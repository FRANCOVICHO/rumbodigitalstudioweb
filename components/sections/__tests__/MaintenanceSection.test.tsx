// Framer Motion mock — must be before all imports
vi.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import fc from "fast-check";
import {
  MAINTENANCE_PLANS,
  COMPARATOR_WITHOUT,
  COMPARATOR_WITH,
  STATS,
  WHATSAPP_MESSAGES,
  MaintenanceSection,
} from "@/components/sections/MaintenanceSection";

// ─── Header ──────────────────────────────────────────────────────────────────

describe("Header", () => {
  it('renders title "Mantenimiento mensual"', () => {
    render(<MaintenanceSection />);
    expect(screen.getByText("Mantenimiento mensual")).toBeTruthy();
  });

  it("renders the exact subtitle", () => {
    render(<MaintenanceSection />);
    expect(
      screen.getByText(/Tu página web no termina cuando la publicamos/)
    ).toBeTruthy();
  });
});

// ─── Plans ───────────────────────────────────────────────────────────────────

describe("Plans", () => {
  it("renders exactly 2 plan cards", () => {
    render(<MaintenanceSection />);
    expect(screen.getAllByText(/Plan (Básico|Avanzado)/)).toHaveLength(2);
  });

  it('Plan Avanzado has badge "⭐ Más elegido"', () => {
    render(<MaintenanceSection />);
    expect(screen.getByText("⭐ Más elegido")).toBeTruthy();
  });

  it('Plan Básico CTA button text is "Contratar"', () => {
    render(<MaintenanceSection />);
    expect(screen.getByText("Contratar")).toBeTruthy();
  });

  it('Plan Avanzado CTA button text is "Quiero este plan"', () => {
    render(<MaintenanceSection />);
    expect(screen.getByText("Quiero este plan")).toBeTruthy();
  });
});

// ─── Comparator ──────────────────────────────────────────────────────────────

describe("Comparator", () => {
  it('renders column heading "Sin mantenimiento"', () => {
    render(<MaintenanceSection />);
    expect(screen.getByText("Sin mantenimiento")).toBeTruthy();
  });

  it('renders column heading "Con mantenimiento"', () => {
    render(<MaintenanceSection />);
    expect(screen.getByText("Con mantenimiento")).toBeTruthy();
  });
});

// ─── WhatsApp Demo ────────────────────────────────────────────────────────────

describe("WhatsApp Demo", () => {
  it('renders "¿Cómo funciona?" heading', () => {
    render(<MaintenanceSection />);
    expect(screen.getByText("¿Cómo funciona?")).toBeTruthy();
  });

  it("renders client WhatsApp bubble text", () => {
    render(<MaintenanceSection />);
    expect(screen.getByText(/Podés agregar un banner/)).toBeTruthy();
  });

  it("renders studio WhatsApp bubble text", () => {
    render(<MaintenanceSection />);
    expect(screen.getByText(/Ya está publicado/)).toBeTruthy();
  });

  it("renders WhatsApp demo closing text", () => {
    render(<MaintenanceSection />);
    expect(screen.getByText(/Así de simple/)).toBeTruthy();
  });
});

// ─── CTA Final ────────────────────────────────────────────────────────────────

describe("CTA Final", () => {
  it('renders CTA title "Tu negocio cambia todos los días."', () => {
    render(<MaintenanceSection />);
    expect(screen.getByText("Tu negocio cambia todos los días.")).toBeTruthy();
  });

  it('renders CTA subtitle "Tu página web también debería poder hacerlo."', () => {
    render(<MaintenanceSection />);
    expect(
      screen.getByText("Tu página web también debería poder hacerlo.")
    ).toBeTruthy();
  });

  it('renders CTA primary button "Quiero olvidarme de la parte técnica"', () => {
    render(<MaintenanceSection />);
    expect(
      screen.getByText("Quiero olvidarme de la parte técnica")
    ).toBeTruthy();
  });

  it('renders CTA secondary button "Consultar planes"', () => {
    render(<MaintenanceSection />);
    expect(screen.getByText("Consultar planes")).toBeTruthy();
  });
});

// ─── Structure ────────────────────────────────────────────────────────────────

describe("Structure", () => {
  it('section has id="mantenimiento"', () => {
    const { container } = render(<MaintenanceSection />);
    expect(container.querySelector("#mantenimiento")).toBeTruthy();
  });

  it("section has class bg-background", () => {
    const { container } = render(<MaintenanceSection />);
    expect(container.querySelector("#mantenimiento")?.className).toMatch(
      /bg-background/
    );
  });

  it("blobs have animate-blob class", () => {
    const { container } = render(<MaintenanceSection />);
    expect(container.querySelector(".animate-blob")).toBeTruthy();
  });

  it("plans-grid has grid-cols-1 class (mobile-first)", () => {
    const { container } = render(<MaintenanceSection />);
    const grid = container.querySelector("[data-testid='plans-grid']");
    expect(grid?.className).toMatch(/grid-cols-1/);
  });
});

// ─── Property-Based Tests ────────────────────────────────────────────────────

describe("Property-Based Tests", () => {
  /**
   * Property 1: every plan feature renders in the component
   * Validates: Requirements 2.2, 2.3
   */
  it("Property 1: every plan feature renders in the component", () => {
    render(<MaintenanceSection />);
    fc.assert(
      fc.property(
        fc.constantFrom(...MAINTENANCE_PLANS),
        fc.nat({ max: 14 }),
        (plan, seed) => {
          const idx = seed % plan.features.length;
          // Use getAllByText because shared features (e.g. "Hosting incluido")
          // appear in both plan cards and getByText would throw on multiple matches.
          expect(screen.getAllByText(plan.features[idx]).length).toBeGreaterThan(0);
        }
      )
    );
  });

  /**
   * Property 2: every comparator item renders in the component
   * Validates: Requirements 3.2, 3.3
   */
  it("Property 2: every comparator item renders in the component", () => {
    render(<MaintenanceSection />);
    const allItems = [...COMPARATOR_WITHOUT, ...COMPARATOR_WITH];
    fc.assert(
      fc.property(fc.constantFrom(...allItems), (text) => {
        expect(screen.getByText(text)).toBeTruthy();
      })
    );
  });

  /**
   * Property 3: client bubbles are self-start, studio bubbles are self-end
   * Validates: Requirements 4.3
   */
  it("Property 3: client bubbles are self-start, studio bubbles are self-end", () => {
    render(<MaintenanceSection />);
    fc.assert(
      fc.property(fc.constantFrom(...WHATSAPP_MESSAGES), (message) => {
        const el = screen.getByText(message.text);
        const bubble = el.closest("[data-testid='whatsapp-bubble']");
        if (message.sender === "client") {
          expect(bubble?.className).toMatch(/self-start/);
        } else {
          expect(bubble?.className).toMatch(/self-end/);
        }
      })
    );
  });

  /**
   * Property 4: each stat card has glassmorphism classes
   * Validates: Requirements 5.1, 5.2
   */
  it("Property 4: each stat card has glassmorphism classes", () => {
    render(<MaintenanceSection />);
    fc.assert(
      fc.property(fc.constantFrom(...STATS), (stat) => {
        const el = screen.getByText(stat.label);
        const card = el.closest("[data-testid='stat-card']");
        expect(card?.className).toMatch(/bg-background-card/);
        expect(card?.className).toMatch(/border/);
      })
    );
  });

  /**
   * Property 5: plans-grid uses grid-cols-1 as base class (mobile-first)
   * Validates: Requirements 8.4
   */
  it("Property 5: plans-grid uses grid-cols-1 as base class", () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const { container } = render(<MaintenanceSection />);
        const grid = container.querySelector("[data-testid='plans-grid']");
        expect(grid?.className).toMatch(/grid-cols-1/);
      })
    );
  });
});
