// Changed by the Ilya project, 2026-10-05: adds HOMR_MAIN_COMMIT, the homr main commit that model 465 follows.
/** The homr release and commit this port reproduces, and whose models it loads. */
export const HOMR_VERSION = "0.7.0" as const;
export const HOMR_COMMIT = "8b5dcf7d7bdd1a47911dc0c661c573b957271eab" as const;

/** The homr main commit whose code paths and model 465 this copy follows when `model` is "465" (Ilya project). */
export const HOMR_MAIN_COMMIT =
  "560ca5ce254db129b1b2167598bdc7a20ac5d6b0" as const;
