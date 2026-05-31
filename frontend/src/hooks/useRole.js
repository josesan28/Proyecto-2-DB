import { useAuth } from "../context/AuthContext";

const normalize = (cargo = "") =>
  cargo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const JERARQUIA = {
  admin:     ["admin"],
  gerente:   ["admin", "gerente"],
  vendedor:  ["admin", "gerente", "vendedor"],
  bodeguero: ["admin", "gerente", "bodeguero"],
  auditor:   ["auditor"],
};

export function useRole() {
  const { empleado } = useAuth();
  const cargo = normalize(empleado?.cargo ?? "");

  const can = (...roles) =>
    roles.some((role) => {
      const group = JERARQUIA[role];
      return group ? group.includes(cargo) : cargo === role;
    });

  return { cargo, can };
}
