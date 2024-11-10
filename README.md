# Pruebas Automatizadas

**Integrantes:**
1. Isaac Alejandro Blanco Amador i.blancoa@uniandes.edu.co
2. Raúl José López Grau rj.lopezg1@uniandes.edu.co
3. Neider Fajardo Hurtado n.fajardo@uniandes.edu.co
4. Juan Camilo Mora Garcia jc.morag12@uniandes.edu.co

## Información General
Los archivos de playwright se encuentran en la carpeta [e2e-playwright/](https://github.com/AlejandroBlanco2001/GhostE2E/tree/main/e2e-playwright).

Los features de kraken se encuentran en [features/](https://github.com/AlejandroBlanco2001/GhostE2E/tree/main/features).

Ambas herramientas están corriendo en **CI / Github Actions** en este repositorio. Para ver los últimos resultados es posible verlos en el apartado [Actions](https://github.com/AlejandroBlanco2001/GhostE2E/actions) de este repositorio.

Workflows implementados:
1. [Playwright](https://github.com/AlejandroBlanco2001/GhostE2E/blob/main/.github/workflows/playwright.yml)
2. [Kraken](https://github.com/AlejandroBlanco2001/GhostE2E/blob/main/.github/workflows/kraken.yml)

Estos corren en cada commit a master o en cada Pull request a master.

## Playwright

### Instrucciones

Estas son las instrucciones para correr las pruebas en una máquina Linux

#### 1. Instalar dependencias

```bash
npm install
```

#### 2. Instalar dependencias del sistema

1. Docker
2. Chromium

#### 3. Correr las pruebas

Solo es necesario ejecutar el siguiente comando:

```bash
npm run test-pw-regular
```

Este comando se encarga de levantar una instancia de Ghost usando Docker y correr las pruebas cada vez que se corra este comando.

Si se tienen problemas para correr las pruebas se puede consultar la manera como se hace en el [CI/Actions](https://github.com/AlejandroBlanco2001/GhostE2E/blob/main/.github/workflows/playwright.yml)

## Kraken

### Instrucciones

Estas son las instrucciones para correr las pruebas en una máquina Linux

#### 1. Instalar dependencias

```bash
npm install
```

#### 2. Instalar dependencias del sistema

1. [Todos los requisitos de kraken](https://github.com/TheSoftwareDesignLab/Kraken#-installation) (adb, cucumber, etc)
2. Docker
3. Chromium

#### 3. Correr las pruebas

Al igual que con playwright, solo es necesario ejecutar el siguiente comando:

```bash
npm run kraken
```

Este comando también se encargará de levantar una instancia de Ghost usando docker y correr todas las pruebas. Cada vez que se corra el comando será un cold start de la aplicación.

Si se tienen problemas para correr las pruebas se puede consultar la manera como se hace en el [CI/Actions](https://github.com/AlejandroBlanco2001/GhostE2E/blob/main/.github/workflows/kraken.yml)
