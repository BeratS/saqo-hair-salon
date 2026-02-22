import * as z from "zod";

// 1. Define the core shape with strict types
const userDetailsShape = z.object({
  isCompany: z.boolean(),
  fullName: z.string().min(3, "Contact person is required"),
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
  contactMethod: z.enum(["phone", "email", "whatsapp"]),
  phone: z.string().min(7, "Please enter a valid phone number"),
  notes: z.string().optional(),
  pickupLocation: z.string().min(5, "Pickup location is required"),
  deliveryLocation: z.string().min(5, "Delivery location is required"),
  preferredTime: z.string().min(1, "Please select a timeframe"),
});

// 2. Export the flat type for React Hook Form
// This ensures 'isCompany' is 'boolean', not 'boolean | undefined'
export type IUserDetails = z.infer<typeof userDetailsShape>;

// 3. Apply the refinement to a separate constant for the resolver
export const userDetailsSchema = userDetailsShape.refine((data) => {
  if (data.isCompany && !data.companyName) return false;
  return true;
}, {
  message: "Company name is required for business orders",
  path: ["companyName"],
});