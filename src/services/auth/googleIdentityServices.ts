export type GsiCredentialResponse = {
  credential?: string;
  select_by?: string;
};

export type GsiIdApi = {
  initialize: (config: {
    client_id: string;
    callback: (response: GsiCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    use_fedcm_for_prompt?: boolean;
    itp_support?: boolean;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, string | number | boolean>) => void;
  prompt?: (momentListener?: (notification: { isNotDisplayed: () => boolean }) => void) => void;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GsiIdApi;
      };
    };
  }
}

export async function waitForGsiId(timeoutMs = 12_000): Promise<GsiIdApi> {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const id = window.google?.accounts?.id;
      if (id) {
        resolve(id);
        return;
      }
      if (Date.now() - started > timeoutMs) {
        reject(new Error('Google Sign-In indisponible (script bloqué ?).'));
        return;
      }
      window.setTimeout(check, 50);
    };
    check();
  });
}
