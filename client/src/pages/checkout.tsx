import { useEffect } from "react";
import { useLocation } from "wouter";
import { type CartItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2, CreditCard } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const checkoutFormSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  pincode: z.string().min(6, "PIN code must be 6 digits").max(6, "PIN code must be 6 digits"),
  state: z.string().min(2, "State is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutProps {
  cartItems: CartItem[];
  onClearCart: () => void;
}

interface CashfreeOrderResponse {
  paymentSessionId: string;
  cashfreeOrderId: string;
}

type CashfreeMode = "sandbox" | "production";

interface CashfreeCheckoutResult {
  error?: {
    message?: string;
  };
}

interface CashfreeInstance {
  checkout: (options: { paymentSessionId: string; redirectTarget: "_modal" | "_self" | "_blank" }) => Promise<CashfreeCheckoutResult>;
}

declare global {
  interface Window {
    Cashfree?: (options: { mode: CashfreeMode }) => CashfreeInstance;
  }
}

const loadCashfreeScript = () => {
  return new Promise<boolean>((resolve) => {
    if (window.Cashfree) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Checkout({ cartItems, onClearCart }: CheckoutProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
      state: "",
    },
  });

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.product.price) * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const orderMutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
      const orderData = {
        ...data,
        items: JSON.stringify(
          cartItems.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
          }))
        ),
        total: total.toString(),
        status: "created",
      };

      const appOrderResponse = await apiRequest("POST", "/api/orders", orderData);
      const appOrder = await appOrderResponse.json();

      const paymentOrderResponse = await apiRequest("POST", "/api/payments/create-order", {
        amount: total,
        currency: "INR",
        appOrderId: appOrder.id,
        customerName: data.customerName,
        customerEmail: data.email,
        customerPhone: data.phone,
      });

      const cashfreeOrder = (await paymentOrderResponse.json()) as CashfreeOrderResponse;
      return { appOrder, cashfreeOrder };
    },
    onSuccess: async ({ appOrder, cashfreeOrder }) => {
      const loaded = await loadCashfreeScript();
      if (!loaded || !window.Cashfree) {
        toast({
          title: "Payment SDK Failed",
          description: "Could not load Cashfree checkout. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const modeValue = (import.meta.env.VITE_CASHFREE_MODE || "sandbox").toLowerCase();
      const mode: CashfreeMode = modeValue === "production" ? "production" : "sandbox";
      const cashfree = window.Cashfree({ mode });

      const result = await cashfree.checkout({
        paymentSessionId: cashfreeOrder.paymentSessionId,
        redirectTarget: "_modal",
      });

      if (result?.error) {
        toast({
          title: "Payment Failed",
          description: result.error.message || "Payment was not completed. Please try again.",
          variant: "destructive",
        });
        return;
      }

      try {
        await apiRequest("POST", "/api/payments/verify", {
          appOrderId: appOrder.id,
          cashfreeOrderId: cashfreeOrder.cashfreeOrderId,
        });

        toast({
          title: "Payment Successful",
          description: "Your order has been confirmed.",
        });
        onClearCart();
        setLocation("/");
      } catch {
        toast({
          title: "Verification Pending",
          description: "Payment may still be processing. Please refresh after a few seconds.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Order Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CheckoutFormValues) => {
    orderMutation.mutate(data);
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      setLocation("/cart");
      return;
    }

    void loadCashfreeScript();
  }, [cartItems.length, setLocation]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="customerName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-customer-name" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number *</FormLabel>
                            <FormControl>
                              <Input {...field} type="tel" data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address *</FormLabel>
                          <FormControl>
                            <Input {...field} data-testid="input-address" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-city" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-state" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pincode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PIN Code *</FormLabel>
                            <FormControl>
                              <Input {...field} data-testid="input-pincode" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-6" />

                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Method
                      </h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          Secure payment with Cashfree (UPI, cards, netbanking, wallets).
                        </p>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={orderMutation.isPending}
                      data-testid="button-place-order"
                    >
                      {orderMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Processing Order...
                        </>
                      ) : (
                        `Pay INR ${total.toFixed(2)}`
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-3" data-testid={`checkout-summary-item-${item.product.id}`}>
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" data-testid={`checkout-summary-name-${item.product.id}`}>
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground" data-testid={`checkout-summary-qty-${item.product.id}`}>
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold" data-testid={`checkout-summary-price-${item.product.id}`}>
                          INR {(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span data-testid="checkout-summary-subtotal">INR {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span data-testid="checkout-summary-shipping">{shipping === 0 ? "FREE" : `INR ${shipping.toFixed(2)}`}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span data-testid="checkout-summary-total">INR {total.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
