import categoryAirSuspension from "@/assets/images/category-air-suspension.jpg";
import categoryBrakeShoes from "@/assets/images/category-brake-shoes.jpg";
import categoryBrakeChambers from "@/assets/images/category-brake-chambers.jpg";
import categoryBrakeDrums from "@/assets/images/category-brake-drums.jpg";

export interface Product {
  id: string;
  name: string;
  sku: string;
  slug: string;
  category: string;
  categorySlug: string;
  description: string;
  specifications: Record<string, string>;
  image: string;
  price: number;
  wholesalePrice: number;
  stock: number;
  status: "active" | "draft" | "archived";
  weightLbs?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  translationKey: string;
  image: string;
  description: string;
}

export type PricingTier = "retail" | "distributor" | "wholesale" | "enterprise";

export const PRICING_TIER_DISCOUNTS: Record<PricingTier, number> = {
  retail: 0,
  distributor: 0.15,
  wholesale: 0.25,
  enterprise: 0.35,
};

export function getTierPrice(basePrice: number, tier: PricingTier): number {
  return +(basePrice * (1 - PRICING_TIER_DISCOUNTS[tier])).toFixed(2);
}

export const categories: Category[] = [
  { id: "cat-1", name: "Air Suspension", slug: "air-suspension", translationKey: "cat.air_suspension", image: categoryAirSuspension, description: "Heavy-duty air springs, bellows, and suspension components" },
  { id: "cat-2", name: "Brake Shoes & Pads", slug: "brake-shoes-pads", translationKey: "cat.brake_shoes", image: categoryBrakeShoes, description: "OEM-quality brake shoes, pads, and hardware kits" },
  { id: "cat-3", name: "Brake Chambers", slug: "brake-chambers", translationKey: "cat.brake_chambers", image: categoryBrakeChambers, description: "Spring and service brake chambers for all axle configurations" },
  { id: "cat-4", name: "Brake Drums", slug: "brake-drums", translationKey: "cat.brake_drums", image: categoryBrakeDrums, description: "Balanced, quality-tested brake drums for heavy-duty applications" },
];

export const products: Product[] = [
  {
    id: "prod-1", name: "Air Spring W01-358 9781", sku: "1T15ZR-6", slug: "air-spring-w01-358-9781",
    category: "Air Suspension", categorySlug: "air-suspension",
    description: "Premium air spring for heavy-duty truck and trailer suspension systems. Direct OEM replacement.",
    specifications: { "Part Number": "W01-358 9781", "Cross Reference": "1T15ZR-6 / 1R12-603", "Type": "Rolling Lobe", "Height": "12.5\"", "Diameter": "6.5\"" },
    image: categoryAirSuspension, price: 89.99, wholesalePrice: 62.99, stock: 145, status: "active", weightLbs: 8.5,
  },
  {
    id: "prod-2", name: "30/30 Long Stroke Brake Chamber", sku: "BC-3030LS", slug: "30-30-long-stroke-brake-chamber",
    category: "Brake Chambers", categorySlug: "brake-chambers",
    description: "30/30 Long Stroke spring brake chamber. Meets FMVSS 121 requirements.",
    specifications: { "Type": "30/30 Long Stroke", "Reference": "1.79.SB30305LWZ25", "Stroke": "3\"", "Push Rod": "5/8\"-18 UNF" },
    image: categoryBrakeChambers, price: 134.50, wholesalePrice: 94.15, stock: 88, status: "active", weightLbs: 32,
  },
  {
    id: "prod-3", name: "ADB22X Air Disc Brake Pad Kit", sku: "ADB22X-PAD", slug: "adb22x-air-disc-brake-pad-kit",
    category: "Brake Shoes & Pads", categorySlug: "brake-shoes-pads",
    description: "Complete air disc brake pad kit for ADB22X calipers. Premium friction material.",
    specifications: { "Application": "ADB22X Caliper", "Material": "Semi-metallic", "Includes": "4 pads + hardware", "Thickness": "30mm" },
    image: categoryBrakeShoes, price: 156.00, wholesalePrice: 109.20, stock: 62, status: "active", weightLbs: 14,
  },
  {
    id: "prod-4", name: "Brake Drum - Gunite 3600A Equivalent", sku: "BD-3600A", slug: "brake-drum-gunite-3600a",
    category: "Brake Drums", categorySlug: "brake-drums",
    description: "Heavy-duty brake drum, Gunite 3600A equivalent. Balanced and quality tested.",
    specifications: { "Size": "16.5\" x 7\"", "Bolt Pattern": "10 x 11.25\"", "Weight": "120 lbs", "Material": "Cast Iron" },
    image: categoryBrakeDrums, price: 198.00, wholesalePrice: 138.60, stock: 34, status: "active", weightLbs: 120,
  },
  {
    id: "prod-5", name: "4709 Hardware Kit", sku: "HW-4709", slug: "4709-hardware-kit",
    category: "Brake Shoes & Pads", categorySlug: "brake-shoes-pads",
    description: "Complete hardware kit for 4709 brake shoes. All springs, pins, and rollers included.",
    specifications: { "Application": "4709 Brake Shoe", "Includes": "Springs, pins, rollers, bushings", "Material": "Heat-treated steel" },
    image: categoryBrakeShoes, price: 28.50, wholesalePrice: 19.95, stock: 230, status: "active", weightLbs: 3.2,
  },
  {
    id: "prod-6", name: "4707Q Brake Shoe Kit", sku: "BS-4707Q", slug: "4707q-brake-shoe-kit",
    category: "Brake Shoes & Pads", categorySlug: "brake-shoes-pads",
    description: "Premium lined brake shoe kit. Q+ friction for extended life.",
    specifications: { "Size": "16.5\" x 7\"", "Lining": "Q+ Premium", "Type": "Lined", "Axle": "Drive / Trailer" },
    image: categoryBrakeShoes, price: 74.99, wholesalePrice: 52.49, stock: 112, status: "active", weightLbs: 22,
  },
  {
    id: "prod-7", name: "4515Q Brake Shoe Assembly Kit", sku: "BS-4515Q", slug: "4515q-brake-shoe-assembly-kit",
    category: "Brake Shoes & Pads", categorySlug: "brake-shoes-pads",
    description: "New brake shoe assembly kit 4515Q. 16.5\" x 7\" with premium lining.",
    specifications: { "Size": "16.5\" x 7\"", "Type": "New Assembly", "Lining": "Premium", "Application": "Drive Axle" },
    image: categoryBrakeShoes, price: 89.99, wholesalePrice: 62.99, stock: 78, status: "active", weightLbs: 24,
  },
  {
    id: "prod-8", name: "4709Q Brake Shoe Assembly - Eaton ES/ESII", sku: "BS-4709Q-EA", slug: "4709q-brake-shoe-assembly-eaton",
    category: "Brake Shoes & Pads", categorySlug: "brake-shoes-pads",
    description: "Brake shoe assembly for Eaton ES/ESII axles. 16.5\" x 7\".",
    specifications: { "Size": "16.5\" x 7\"", "Application": "Eaton ES / ESII", "Type": "Assembly", "Lining": "Standard" },
    image: categoryBrakeShoes, price: 82.00, wholesalePrice: 57.40, stock: 95, status: "active", weightLbs: 23,
  },
];
