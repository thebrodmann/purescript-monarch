{ pkgs ? import ./nix { } }:

pkgs.mkShell {
  name = "purescript-monarch";
  buildInputs = with pkgs; [
    ###################################################
    # Code styles:
    headroom
    nixpkgs-fmt
    nodePackages.prettier

    ###################################################
    # Command line tools:
    gitFull
    nodePackages.parcel-bundler

    ###################################################
    # Languages:
    dhall
    nodePackages.typescript
    nodejs-16_x
    purescript

    ###################################################
    # LSPs:
    dhall-lsp-server
    nodePackages.purescript-language-server
    nodePackages.typescript-language-server
    nodePackages.vscode-html-languageserver-bin
    nodePackages.vscode-json-languageserver-bin
    nodePackages.yaml-language-server

    ###################################################
    # Package managers:
    niv
    spago
  ];
}
