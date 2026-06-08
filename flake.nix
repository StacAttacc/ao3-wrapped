{
  description = "ao3-wrapped dev environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            # Python backend
            python312
            python312Packages.pip
            python312Packages.virtualenv

            # Node frontend
            nodejs_22

            # Tooling
            git
          ];

          shellHook = ''
            if [ ! -d .venv ]; then
              python -m venv .venv
            fi
            source .venv/bin/activate

            if [ ! -d frontend/node_modules ]; then
              echo "Installing frontend dependencies..."
              (cd frontend && npm install)
            fi
          '';
        };
      });
}
