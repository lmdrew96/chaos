// Phase 2 smoke test: prove cross-app import resolution from the monorepo.
// If this re-export fails at build time, we've found the seam that justifies
// extracting @chaos/ui or @chaos/utils into packages/.
export { cn } from "@chaoslimba/lib/utils"
