import type { ItemType } from "@/lib/store";

export interface FieldDefinition {
  name: string;
  label: string;
  options: string[];
}

export const ITEM_FIELDS: Record<Exclude<ItemType, null>, FieldDefinition[]> = {
  sweater: [
    {
      name: "size",
      label: "Size",
      options: ["XS", "S", "M", "L", "XL", "2XL"],
    },
    {
      name: "construction",
      label: "Construction",
      options: ["Raglan", "Circular yoke", "Dropped shoulder"],
    },
    {
      name: "fit",
      label: "Fit",
      options: ["Oversized", "Relaxed", "Classic", "Fitted"],
    },
    {
      name: "neckline",
      label: "Neckline",
      options: ["Crew neck", "V-neck", "Turtleneck", "Boat neck"],
    },
    {
      name: "sleeveLength",
      label: "Sleeve length",
      options: ["Long", "3/4", "Short", "Sleeveless"],
    },
    {
      name: "cuff",
      label: "Cuff",
      options: ["Ribbed", "Rolled", "Straight"],
    },
    {
      name: "hem",
      label: "Hem",
      options: ["Ribbed", "Rolled", "Straight"],
    },
  ],
  slipover: [
    {
      name: "size",
      label: "Size",
      options: ["XS", "S", "M", "L", "XL", "2XL"],
    },
    {
      name: "construction",
      label: "Construction",
      options: ["Top-down", "Bottom-up", "Seamless", "Seamed"],
    },
    {
      name: "neckline",
      label: "Neckline",
      options: ["Crew neck", "V-neck", "Scoop neck", "Square neck"],
    },
    {
      name: "fit",
      label: "Fit",
      options: ["Oversized", "Relaxed", "Classic", "Fitted"],
    },
    {
      name: "hem",
      label: "Hem",
      options: ["Ribbed", "Rolled", "Straight", "Curved"],
    },
  ],
  "t-shirt": [
    {
      name: "size",
      label: "Size",
      options: ["XS", "S", "M", "L", "XL", "2XL"],
    },
    {
      name: "neckline",
      label: "Neckline",
      options: ["Crew neck", "V-neck", "Scoop neck", "Boat neck"],
    },
    {
      name: "fit",
      label: "Fit",
      options: ["Oversized", "Relaxed", "Classic", "Fitted"],
    },
    {
      name: "hem",
      label: "Hem",
      options: ["Ribbed", "Rolled", "Straight", "Curved"],
    },
  ],
  beanie: [
    {
      name: "size",
      label: "Size",
      options: ["S/M", "M/L", "L/XL"],
    },
    {
      name: "brim",
      label: "Brim",
      options: ["No brim", "Folded", "Short ribbed", "Wide ribbed"],
    },
    {
      name: "crownShape",
      label: "Crown shape",
      options: ["Classic", "Slouchy", "Pointy", "Flat"],
    },
  ],
  gloves: [
    {
      name: "size",
      label: "Size",
      options: ["S/M", "M/L", "L/XL"],
    },
    {
      name: "coverage",
      label: "Coverage",
      options: ["Full fingers", "Fingerless", "Half fingers", "Mittens"],
    },
    {
      name: "cuff",
      label: "Cuff",
      options: ["Short", "Long", "Ribbed", "Folded"],
    },
  ],
  scarf: [
    {
      name: "size",
      label: "Length",
      options: ["150 cm", "180 cm", "210 cm", "250 cm"],
    },
    {
      name: "width",
      label: "Width",
      options: ["Narrow", "Medium", "Wide", "Shawl"],
    },
    {
      name: "stitchPattern",
      label: "Stitch pattern",
      options: ["Stockinette", "Garter", "Ribbed", "Textured"],
    },
  ],
  mittens: [
    {
      name: "size",
      label: "Size",
      options: ["S/M", "M/L", "L/XL"],
    },
    {
      name: "cuffStyle",
      label: "Cuff style",
      options: ["Short ribbed", "Long ribbed", "Folded", "No cuff"],
    },
    {
      name: "thumbType",
      label: "Thumb type",
      options: ["Afterthought", "Gusset", "No thumb", "Flap"],
    },
  ],
  hood: [
    {
      name: "size",
      label: "Size",
      options: ["S/M", "M/L", "L/XL"],
    },
    {
      name: "type",
      label: "Hood type",
      options: ["Standard", "Oversized", "Gnome", "Cowl"],
    },
    {
      name: "closure",
      label: "Closure",
      options: ["Open", "Drawstring", "Button", "Zipper"],
    },
  ],
};
