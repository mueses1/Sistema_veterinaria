import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import Swal from 'sweetalert2';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface CartResponse {
  user_id: string;
  items: CartItem[];
}

const Carrito = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);

  const fetchCart = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}`);
      if (!res.ok) return;
      const data: CartResponse = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error cargando carrito', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }
    fetchCart();
  }, [isAuthenticated, user]);

  const total = cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) ?? 0;

  const formatCOP = (value: number) =>
    `COP ${new Intl.NumberFormat('es-CO', {
      maximumFractionDigits: 0,
    }).format(value)}`;

  const handleRemoveItem = async (productId: string) => {
    if (!user) return;
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}/items/${productId}`, {
        method: 'DELETE',
      });
      if (!res.ok) return;
      const data: CartResponse = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error eliminando producto del carrito', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleCheckout = async () => {
    if (!user || !cart || cart.items.length === 0) return;

    let paymentMethod: string | null = null;
    let paymentData: any = null;

    // 1. Seleccionar método de pago (con posibilidad de volver en todos los casos)
    while (true) {
      const { value } = await Swal.fire({
        title: 'Selecciona método de pago',
        input: 'radio',
        inputOptions: {
          efectivo: 'Efectivo',
          transferencia: 'Transferencia',
          tarjeta: 'Tarjeta de crédito / débito',
        },
        inputValidator: (val) => {
          if (!val) {
            return 'Debes seleccionar un método de pago';
          }
          return null;
        },
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
      });

      if (!value) {
        // Canceló en la selección de método: salir del flujo
        return;
      }

      // Si es tarjeta, pedir datos. Si cancela ahí, volvemos al inicio del while.
      if (value === 'tarjeta') {
        const { value: formValues } = await Swal.fire<{ [key: string]: string }>({
          title: 'Datos de pago',
          html: `
            <div style="display:flex; flex-direction:column; gap:10px; text-align:left;">
              <label style="font-size:13px; font-weight:600; color:#0f172a;">Nombre del titular</label>
              <input id="swal-input-holder" class="swal2-input" placeholder="Nombre del titular" style="margin:0; border:1px solid #0f172a;" />

              <label style="font-size:13px; font-weight:600; color:#0f172a;">Número de tarjeta</label>
              <input id="swal-input-number" class="swal2-input" placeholder="Número de tarjeta" maxlength="19" style="margin:0; border:1px solid #0f172a;" />

              <label style="font-size:13px; font-weight:600; color:#0f172a;">Mes (MM)</label>
              <input id="swal-input-exp-month" class="swal2-input" placeholder="Mes (MM)" maxlength="2" style="margin:0; border:1px solid #0f172a;" />

              <label style="font-size:13px; font-weight:600; color:#0f172a;">Año (AA)</label>
              <input id="swal-input-exp-year" class="swal2-input" placeholder="Año (AA)" maxlength="2" style="margin:0; border:1px solid #0f172a;" />

              <label style="font-size:13px; font-weight:600; color:#0f172a;">CVV</label>
              <input id="swal-input-cvv" class="swal2-input" placeholder="CVV" maxlength="4" style="margin:0; border:1px solid #0f172a;" />
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          cancelButtonText: 'Atrás',
          preConfirm: () => {
            const holder = (document.getElementById('swal-input-holder') as HTMLInputElement)?.value;
            const number = (document.getElementById('swal-input-number') as HTMLInputElement)?.value;
            const expMonth = (document.getElementById('swal-input-exp-month') as HTMLInputElement)?.value;
            const expYear = (document.getElementById('swal-input-exp-year') as HTMLInputElement)?.value;
            const cvv = (document.getElementById('swal-input-cvv') as HTMLInputElement)?.value;

            if (!holder || !number) {
              Swal.showValidationMessage('Nombre del titular y número de tarjeta son obligatorios');
              return null as any;
            }

            return {
              holder,
              number,
              expMonth,
              expYear,
              cvv,
            };
          },
        });

        if (!formValues) {
          // Canceló en el formulario de tarjeta: volver a seleccionar método
          continue;
        }

        paymentMethod = value;
        paymentData = {
          card_holder: formValues.holder,
          card_number: formValues.number,
          expiry_month: formValues.expMonth ? Number(formValues.expMonth) : null,
          expiry_year: formValues.expYear ? Number(formValues.expYear) : null,
          cvv: formValues.cvv,
        };
      } else if (value === 'transferencia') {
        // Transferencia: pedir datos de la cuenta origen
        const { value: transferValues } = await Swal.fire<{ [key: string]: string }>({
          title: 'Datos de la transferencia',
          html: `
            <div style="display:flex; flex-direction:column; gap:10px; text-align:left;">
              <label style="font-size:13px; font-weight:600; color:#0f172a;">Titular de la cuenta</label>
              <input id="swal-input-transfer-holder" class="swal2-input" placeholder="Nombre del titular" style="margin:0; border:1px solid #0f172a;" />

              <label style="font-size:13px; font-weight:600; color:#0f172a;">Banco</label>
              <input id="swal-input-transfer-bank" class="swal2-input" placeholder="Banco" style="margin:0; border:1px solid #0f172a;" />

              <label style="font-size:13px; font-weight:600; color:#0f172a;">Tipo de cuenta</label>
              <input id="swal-input-transfer-type" class="swal2-input" placeholder="Ahorros / Corriente" style="margin:0; border:1px solid #0f172a;" />

              <label style="font-size:13px; font-weight:600; color:#0f172a;">Número de cuenta</label>
              <input id="swal-input-transfer-number" class="swal2-input" placeholder="Número de cuenta" style="margin:0; border:1px solid #0f172a;" />
            </div>
          `,
          focusConfirm: false,
          showCancelButton: true,
          cancelButtonText: 'Atrás',
          preConfirm: () => {
            const holder = (document.getElementById('swal-input-transfer-holder') as HTMLInputElement)?.value;
            const bank = (document.getElementById('swal-input-transfer-bank') as HTMLInputElement)?.value;
            const type = (document.getElementById('swal-input-transfer-type') as HTMLInputElement)?.value;
            const number = (document.getElementById('swal-input-transfer-number') as HTMLInputElement)?.value;

            if (!holder || !bank || !number) {
              Swal.showValidationMessage('Titular, banco y número de cuenta son obligatorios');
              return null as any;
            }

            return { holder, bank, type, number };
          },
        });

        if (!transferValues) {
          // Canceló en el formulario de transferencia: volver a seleccionar método
          continue;
        }

        paymentMethod = value;
        paymentData = {
          transfer_holder: transferValues.holder,
          transfer_bank: transferValues.bank,
          transfer_account_type: transferValues.type,
          transfer_account_number: transferValues.number,
        };
      } else {
        // Efectivo: no requiere más datos
        paymentMethod = value;
        paymentData = null;
      }

      // Confirmar método antes de continuar; si cancela, vuelve al inicio del while
      const confirmResult = await Swal.fire({
        title: 'Confirmar método de pago',
        text: `Has seleccionado: ${
          paymentMethod === 'efectivo'
            ? 'Efectivo'
            : paymentMethod === 'transferencia'
            ? 'Transferencia'
            : 'Tarjeta de crédito / débito'
        }`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cambiar método',
      });

      if (!confirmResult.isConfirmed) {
        // Volver a seleccionar método
        paymentMethod = null;
        paymentData = null;
        continue;
      }

      // Método confirmado, salir del bucle
      break;
    }

    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method: paymentMethod,
          payment_data: paymentData,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        await Swal.fire({
          icon: 'error',
          title: 'Error en la compra',
          text: err?.detail || 'No se pudo completar la compra.',
        });
        return;
      }

      const data = await res.json();

      // Construir lista de productos para el recibo
      const itemsHtml = data.items
        .map(
          (item: CartItem) =>
            `<tr>
              <td style="padding:4px 8px; text-align:left;">${item.name}</td>
              <td style="padding:4px 8px; text-align:center;">${item.quantity}</td>
              <td style="padding:4px 8px; text-align:right;">${formatCOP(item.price * item.quantity)}</td>
            </tr>`
        )
        .join('');

      const extraPaymentInfo = data.payment_details?.method === 'transferencia'
        ? `
          <p style="margin-top:8px; font-size:13px;">
            <b>Cuenta origen:</b> ${data.payment_details.transfer_holder || ''} - ${data.payment_details.transfer_bank || ''}
          </p>
          <p style="margin-top:2px; font-size:13px;">
            <b>Tipo de cuenta:</b> ${data.payment_details.transfer_account_type || ''}
          </p>
          <p style="margin-top:2px; font-size:13px;">
            <b>Número de cuenta:</b> ${data.payment_details.transfer_account_number || ''}
          </p>
        `
        : '';

      const reciboHtml = `
        <p>Orden: <b>${data.order_id}</b></p>
        <table style="width:100%; border-collapse:collapse; margin-top:8px; font-size:13px;">
          <thead>
            <tr>
              <th style="text-align:left; border-bottom:1px solid #ccc; padding:4px 8px;">Producto</th>
              <th style="text-align:center; border-bottom:1px solid #ccc; padding:4px 8px;">Cant.</th>
              <th style="text-align:right; border-bottom:1px solid #ccc; padding:4px 8px;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <p style="margin-top:12px; font-size:14px;"><b>Total a pagar:</b> ${formatCOP(data.total)}</p>
        <p style="margin-top:4px; font-size:13px;">Método de pago: <b>${data.payment_details?.method || data.payment_method}</b></p>
        ${extraPaymentInfo}
      `;

      const isCash = paymentMethod === 'efectivo';

      const result = await Swal.fire({
        icon: 'success',
        title:
          isCash ? 'Recibo de pago en efectivo' : 'Compra realizada',
        html: reciboHtml,
        confirmButtonText: isCash ? 'Imprimir recibo' : 'Aceptar',
        width: 600,
      });

      if (isCash && result.isConfirmed) {
        window.print();
      }

      await fetchCart();
    } catch (error) {
      console.error('Error realizando checkout', error);
      await Swal.fire({
        icon: 'error',
        title: 'Error en la compra',
        text: 'Ocurrió un error inesperado.',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleClearCart = async () => {
    if (!user) return;
    try {
      setUpdating(true);
      const res = await fetch(`${API_BASE_URL}/cart/${user.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) return;
      const data: CartResponse = await res.json();
      setCart(data);
    } catch (error) {
      console.error('Error vaciando carrito', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 pt-24">
        <Navbar />
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Carrito de compra</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Debes iniciar sesión para ver y gestionar tu carrito de compra.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/login')}
            >
              Ir a iniciar sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 pt-24">
      <Navbar />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-gray-100">
              Carrito de compra
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl text-sm md:text-base">
              Revisa los productos que has agregado al carrito y confirma tu pedido cuando estés listo.
            </p>
          </div>

          {cart && cart.items.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500 dark:text-gray-300">Total estimado</p>
                <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {formatCOP(total)}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={handleCheckout}
                disabled={updating}
              >
                Comprar
              </Button>
              <Button
                variant="outline"
                onClick={handleClearCart}
                disabled={updating}
              >
                Vaciar carrito
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando carrito...</p>
        ) : !cart || cart.items.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-300 max-w-md mx-auto mt-10">
            <p className="mb-4">Tu carrito está vacío.</p>
            <Button
              variant="primary"
              onClick={() => navigate('/catalogo-productos')}
            >
              Ver catálogo de productos
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {cart.items.map((item) => (
              <div
                key={item.product_id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col hover:-translate-y-2"
              >
                {item.image_url ? (
                  <div className="w-full h-32 md:h-36 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-dashed rounded-t-2xl w-full h-32 md:h-36" />
                )}
                <div className="p-4 md:p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold mb-1 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Cantidad: <span className="font-semibold">{item.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Precio unitario: {formatCOP(item.price)}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-base md:text-lg font-black text-emerald-600">
                      {formatCOP(item.price * item.quantity)}
                    </span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(item.product_id)}
                      disabled={updating}
                    >
                      Quitar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Carrito;
