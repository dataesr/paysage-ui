export const fakeAnalysis = [
  { index: 1, displayName: 'Structure 1', body: {}, status: 'warning', warning: [{ message: 'Cette structure semble être un doublon' }, { message: "L'identifant siret est utilisé par une autre structure" }], error: null },
  { index: 2, displayName: 'Structure 2', body: {}, status: 'success', warning: null, error: null },
  { index: 3, displayName: 'Structure 3', body: {}, status: 'error', warning: null, error: [{ message: 'Cette structure est un doublon' }] },
  { index: 4, displayName: 'Structure 4', body: {}, status: 'success', warning: null, error: null },
  { index: 5, displayName: 'Structure 5', body: {}, status: 'success', warning: null, error: null },
  { index: 6, displayName: 'Structure 6', body: {}, status: 'warning', warning: [{ message: 'Cette structure semble être un doublon' }, { message: "L'identifant siret est utilisé par une autre structure" }], error: null },
  { index: 7, displayName: 'Structure 7', body: {}, status: 'success', warning: null, error: null },
  { index: 8, displayName: 'Structure 8', body: {}, status: 'success', warning: null, error: null },
];
export const fakeResults = [
  { index: 1, displayName: 'Structure 1', body: {}, status: 'success', errors: null },
  { index: 2, displayName: 'Structure 2', body: {}, status: 'success', errors: null },
  { index: 3, displayName: 'Structure 3', body: {}, status: 'error', errors: [] },
  { index: 4, displayName: 'Structure 4', body: {}, status: 'success', errors: null },
  { index: 5, displayName: 'Structure 5', body: {}, status: 'success', errors: null },
  { index: 6, displayName: 'Structure 6', body: {}, status: 'success', errors: null },
  { index: 7, displayName: 'Structure 7', body: {}, status: 'success', errors: null },
  { index: 8, displayName: 'Structure 8', body: {}, status: 'success', errors: null },
];
