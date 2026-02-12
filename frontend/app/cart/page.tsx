"use client";
import { useEffect, useState } from "react";
import NavigationBar from "../navigation-bar/page";

interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  image_url: string;
}

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState("");

  // Fetch cart and products on mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");

    // 2. Safety check
    if (!storedUserId) {
      alert("User ID not found. Please Log Out and Log In again.");
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch cart for current user only
        const cartRes = await fetch(
          `http://127.0.0.1:8000/cart?user_id=${storedUserId}`,
        );
        const cartItems = await cartRes.json();
        setCart(Array.isArray(cartItems) ? cartItems : []);

        // Fetch all products
        const productsRes = await fetch("http://127.0.0.1:8000/products");
        const productsData = await productsRes.json();

        // Create product map
        const productMap: Record<number, Product> = {};
        // const userFromItem = cartItems[0].user;

        // console.log("Cart Data fetched:", userFromItem);
        productsData.forEach((product: Product) => {
          productMap[product.id] = product;
        });
        setProducts(productMap);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const removeFromCart = async (productId: number) => {
    try {
      const storedUserId = localStorage.getItem("user_id");
      const q = storedUserId ? `?user_id=${storedUserId}` : "";
      await fetch(`http://127.0.0.1:8000/cart/remove/${productId}${q}`, {
        method: "DELETE",
      });
      setCart(cart.filter((item) => item.product_id !== productId));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cart.find((item) => item.id === itemId)?.product_id || 0);
      return;
    }

    try {
      const storedUserId = localStorage.getItem("user_id");

      // 2. Safety check
      if (!storedUserId) {
        alert("User ID not found. Please Log Out and Log In again.");
        return;
      }
      const response = await fetch(`http://127.0.0.1:8000/cart/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: parseInt(storedUserId),
          product_id: cart.find((item) => item.id === itemId)?.product_id,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        setCart(
          cart.map((item) =>
            item.id === itemId ? { ...item, quantity } : item,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const totalPrice = cart.reduce((sum, item) => {
    const product = products[item.product_id];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("username");

    if (storedUser) {
      setUser(storedUser);
    } else {
      setUser("");
    }
  }, []);

  const handlePurchase = async () => {
    // 1. Retrieve the numeric ID
    const storedUserId = localStorage.getItem("user_id");

    // 2. Safety check
    if (!storedUserId) {
      alert("User ID not found. Please Log Out and Log In again.");
      return;
    }

    setLoading(true);

    const payload = {
      // 3. Convert the string "5" to the number 5
      user_id: parseInt(storedUserId),
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: products[item.product_id]?.price || 0,
      })),
    };

    try {
      const response = await fetch("http://localhost:8000/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order Placed! ID: ${data.order_id}`);
        setCart([]); // Clear the UI cart
        // Ideally, also clear the cart in the backend here
      } else {
        console.error("Server Error:", data);
        alert(
          `Purchase failed: ${data.detail ? JSON.stringify(data.detail) : "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Network Error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <NavigationBar />
        <div className="p-10 text-center text-xl">Loading cart...</div>
      </>
    );
  }

  return (
    <>
      <NavigationBar />
      <div className="min-h-screen bg-gray-50 p-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Order Confirmation
        </h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">
            Your cart is empty.
          </p>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                      Quantity
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                      Subtotal
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => {
                    const product = products[item.product_id];
                    if (!product) return null;

                    const subtotal = product.price * item.quantity;

                    return (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          LKR {product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded font-semibold"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(
                                  item.id,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="w-30 text-center font-semibold border border-red-300 rounded px-2 py-1 text-gray-900"
                            />
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded font-semibold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          LKR {subtotal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition-colors"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm">
                <div className="flex justify-between mb-4 text-lg font-semibold">
                  <span>Total:</span>
                  <span className="text-blue-600">
                    LKR {totalPrice.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => {
                    cart.forEach((item) => {
                      removeFromCart(item.product_id);
                    });
                    handlePurchase();
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
