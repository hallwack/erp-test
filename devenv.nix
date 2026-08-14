{
  pkgs,
  lib,
  config,
  inputs,
  ...
}:

{
  # https://devenv.sh/packages/
  packages = [
    pkgs.laravel
  ];

  # https://devenv.sh/languages/
  languages = {
    php = {
      enable = true;
      version = "8.4";
      packages = {
        composer = pkgs.phpPackages.composer;
      };
    };

    javascript = {
      enable = true;
      npm = {
        enable = true;
        install = {
          enable = true;
        };
      };
    };
  };

  # https://devenv.sh/processes/
  processes = {
    n8n = {
      exec = ''
        exec docker run --rm \
          --publish 5678:5678 \
          --volume devenv-n8n-data:/home/node/.n8n \
          --env N8N_SECURE_COOKIE=false \
          docker.n8n.io/n8nio/n8n:latest
      '';
    };
  };

  # https://devenv.sh/services/
  # services.postgres.enable = true;

  # https://devenv.sh/scripts/
  scripts = {
    sail = {
      exec = ''
        if [ ! -x ./vendor/bin/sail ]; then
          echo "Laravel Sail is not installed. Run composer install first." >&2
          exit 1
        fi
        exec ./vendor/bin/sail "$@"
      '';
      description = "Run Laravel Sail commands";
    };
    artisan = {
      exec = ''
        if [ ! -x ./vendor/bin/sail ]; then
          echo "Laravel Sail is not installed. Run composer install first." >&2
          exit 1
        fi
        exec ./vendor/bin/sail artisan "$@"
      '';
      description = "Run Laravel Artisan through Sail";
    };
  };

  env = {
    N8N_PORT = "5678";
    N8N_SECURE_COOKIE = "false";
    N8N_USER_FOLDER = "${config.env.DEVENV_STATE}/n8n";
  };

  # https://devenv.sh/basics/
  enterShell = ''
    export PATH="$(composer config --global home)/vendor/bin:$PATH"
    echo "Laravel development environment"
    echo "  sail up       - start Laravel Sail services"
    echo "  sail artisan  - run Artisan through Sail"
    echo "  devenv up     - start n8n at http://localhost:5678"
  '';

  # https://devenv.sh/tasks/
  # tasks = {
  #   "myproj:setup".exec = "mytool build";
  #   "devenv:enterShell".after = [ "myproj:setup" ];
  # };

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running tests"
    git --version | grep --color=auto "${pkgs.git.version}"
  '';

  # https://devenv.sh/git-hooks/
  # git-hooks.hooks.shellcheck.enable = true;

  # See full reference at https://devenv.sh/reference/options/
}
