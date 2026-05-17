{
  description = "Typescript dev template";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.11";

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
      ];
      forAll = f: nixpkgs.lib.genAttrs systems (system: f system);
    in
    {
      devShells = forAll (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              typescript
              pnpm
              typescript-language-server
              nodejs
              eslint
              vscode-langservers-extracted
            ];
          };
        }
      );
    };
}
