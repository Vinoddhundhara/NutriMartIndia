import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";

const createPaymentOrderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default("INR"),
  appOrderId: z.string().min(1),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
});

const verifyPaymentSchema = z.object({
  appOrderId: z.string().min(1),
  cashfreeOrderId: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProduct(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to create order" });
      }
    }
  });

  app.post("/api/payments/create-order", async (req, res) => {
    try {
      const appId = process.env.CASHFREE_APP_ID;
      const secretKey = process.env.CASHFREE_SECRET_KEY;
      const env = (process.env.CASHFREE_ENV || "sandbox").toLowerCase();
      const baseUrl =
        env === "production"
          ? "https://api.cashfree.com/pg"
          : "https://sandbox.cashfree.com/pg";

      if (!appId || !secretKey) {
        return res.status(500).json({ error: "Cashfree credentials are not configured" });
      }

      const validatedData = createPaymentOrderSchema.parse(req.body);
      const cashfreeOrderId = `cf_${validatedData.appOrderId}`;

      const cashfreeResponse = await fetch(`${baseUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-version": "2023-08-01",
          "x-client-id": appId,
          "x-client-secret": secretKey,
        },
        body: JSON.stringify({
          order_id: cashfreeOrderId,
          order_amount: Number(validatedData.amount.toFixed(2)),
          order_currency: validatedData.currency,
          customer_details: {
            customer_id: validatedData.appOrderId,
            customer_name: validatedData.customerName,
            customer_email: validatedData.customerEmail,
            customer_phone: validatedData.customerPhone,
          },
          order_meta: {
            return_url: "https://example.com/payment-return",
          },
        }),
      });

      if (!cashfreeResponse.ok) {
        const errorText = await cashfreeResponse.text();
        return res.status(502).json({ error: `Cashfree order creation failed: ${errorText}` });
      }

      const cashfreeOrder = await cashfreeResponse.json();
      return res.status(201).json({
        paymentSessionId: cashfreeOrder.payment_session_id as string,
        cashfreeOrderId: cashfreeOrder.order_id as string,
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to create payment order" });
    }
  });

  app.post("/api/payments/verify", async (req, res) => {
    try {
      const appId = process.env.CASHFREE_APP_ID;
      const secretKey = process.env.CASHFREE_SECRET_KEY;
      const env = (process.env.CASHFREE_ENV || "sandbox").toLowerCase();
      const baseUrl =
        env === "production"
          ? "https://api.cashfree.com/pg"
          : "https://sandbox.cashfree.com/pg";

      if (!appId || !secretKey) {
        return res.status(500).json({ error: "Cashfree credentials are not configured" });
      }

      const validatedData = verifyPaymentSchema.parse(req.body);
      const paymentsResponse = await fetch(
        `${baseUrl}/orders/${encodeURIComponent(validatedData.cashfreeOrderId)}/payments`,
        {
          headers: {
            "x-api-version": "2023-08-01",
            "x-client-id": appId,
            "x-client-secret": secretKey,
          },
        },
      );

      if (!paymentsResponse.ok) {
        const errorText = await paymentsResponse.text();
        return res.status(502).json({ error: `Cashfree verify failed: ${errorText}` });
      }

      const payments = (await paymentsResponse.json()) as Array<{ payment_status?: string; cf_payment_id?: string }>;
      const successfulPayment = payments.find((payment) => payment.payment_status === "SUCCESS");
      if (!successfulPayment) {
        return res.status(400).json({ error: "Payment not completed" });
      }

      const updatedOrder = await storage.updateOrderStatus(validatedData.appOrderId, "paid");
      if (!updatedOrder) {
        return res.status(404).json({ error: "Order not found" });
      }

      return res.status(200).json({
        success: true,
        orderId: updatedOrder.id,
        paymentId: successfulPayment.cf_payment_id ?? "",
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
