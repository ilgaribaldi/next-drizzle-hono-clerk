"use server";
import { Resend } from "resend";
import { ContactEmail } from "@/components/contact-template";

import { z } from "zod";

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  company: z.string().optional(),
  email: z
    .string({
      required_error: "Please enter a valid email.",
    })
    .email(),
  message: z.string().max(380).min(4),
});

const EMAIL_FROM = process.env.EMAIL_FROM;
const EMAIL_TO = process.env.EMAIL_TO;

export async function contactSubmit(prevState: any, formData: FormData) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const validatedFields = contactFormSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      company: formData.get("company"),
    });

    if (!validatedFields.success) {
      return {
        success: false,
        errors: validatedFields.error.flatten().fieldErrors,
        message: "Please check your entries and try again.",
      };
    }

    const { name, email, message, company } = validatedFields.data;

    if (!EMAIL_FROM || !EMAIL_TO) {
      return {
        success: false,
        message: "Oops! There went wrong. Please try again later.",
      };
    }

    const { data: res, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: `Message from ${name} on Rapidwork`,
      react: ContactEmail({ name, email, message, company }),
    });

    if (error) {
      return {
        success: false,
        message:
          "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo más tarde.",
      };
    }

    return {
      success: true,
      message: "¡Gracias por contactarnos! Tu mensaje ha sido enviado.",
    };
  } catch (error) {
    return {
      success: false,
      message: "¡Ups! Algo salió mal. Por favor, inténtalo de nuevo más tarde.",
    };
  }
}
