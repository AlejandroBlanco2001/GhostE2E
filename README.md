# Pruebas Automatizadas

**Integrantes:**
1. Isaac Alejandro Blanco Amador i.blancoa@uniandes.edu.co
2. Raúl José López Grau rj.lopezg1@uniandes.edu.co
3. Neider Fajardo Hurtado n.fajardo@uniandes.edu.co
4. Juan Camilo Mora Garcia jc.morag12@uniandes.edu.co

## Información General
Para la elaboración de las pruebas automatizadas tipo e2e (end-to-end), se hizo uso de las herramientas [Kraken](https://thesoftwaredesignlab.github.io/Kraken/) y la herramienta [Playwright](https://playwright.dev/).

A continuación se dará una una explicación de la estructura del proyecto y de la forma en la que se deben ejecutar los escenarios para cada herramienta, es importante comentar que se realizó la configuración de un pipeline que ejecutá los escenarios para ambas herramientas, con el fin de garantizar que todos los nuevos escenarios que se quieran agregar se ejecuten correctamente.


Los archivos de playwright se encuentran en la carpeta [e2e-playwright/](https://github.com/AlejandroBlanco2001/GhostE2E/tree/main/e2e-playwright).

Los features de kraken se encuentran en [features/](https://github.com/AlejandroBlanco2001/GhostE2E/tree/main/features).

> Ambas herramientas están corriendo en **CI / Github Actions** en este repositorio. Para ver los últimos resultados es posible verlos en el apartado [Actions](https://github.com/AlejandroBlanco2001/GhostE2E/actions) de este repositorio.

Workflows implementados:
1. [Playwright](https://github.com/AlejandroBlanco2001/GhostE2E/blob/main/.github/workflows/playwright.yml)
2. [Kraken](https://github.com/AlejandroBlanco2001/GhostE2E/blob/main/.github/workflows/kraken.yml)

Estos corren en cada commit a master o en cada Pull request a master.

# E2E (Semana 5)

## Playwright E2E

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

Para poder ejecutar las pruebas en Windows, haga uso del siguiente comando:

```bash
npm run test-pw-regular-windows
```

## Kraken E2E

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

#### En caso de error
Ya que la ejecución de las pruebas de kraken también depende de otras configuraciones tanto del sistema operativo, como del dispositivo en el que se estén ejecutando las pruebas, puede que encuentre algunos fallos en la ejecución de los escenarios.

Para esto, se propone una forma alternativa de ejecutar los escenarios localmente, para esto se deben seguir los siguientes pasos.

- Dejar solamente el feature que se quiere probar y comentar los demás renombrando los archivos de la siguiente forma: ```nombre_archivo.feature.commented```
- Ejecutar el comando para compilar los archivos de kraken del escenario que se quiere ejecutar:
```bash
npm run kraken-compile
```
- Ejecutar el comando de kraken para correr la prueba:
```bash
.\node_modules\kraken-node\bin\kraken-node run
```
En Widnows, es necesario hacerlo de la siguiente forma:
```bash
node .\node_modules\kraken-node\bin\kraken-node run
```

Si se tienen problemas para correr las pruebas se puede consultar la manera como se hace en el [CI/Actions](https://github.com/AlejandroBlanco2001/GhostE2E/blob/main/.github/workflows/kraken.yml)

# VRT (Semana 6)

## Playwright VRT

Siga las instrucciones descritas para correr [Playwright E2E](#playwright-e2e) (**ignorando el paso 3**), y luego:

### 1. Ejecutar las pruebas y generar el reporte:

Se elaboró un comando que ejecutará todas las pruebas construidas con Playwright, tanto para la versión **4.5** como para la vestión **5.96.0** de **Ghost** y una vez estas se hayan ejecutado, se generará el reporte a partir de las imágenes que fueron tomadas en cada prueba.
Para lo anterior, ejecute el siguiente comando:

```bash
npm run execute-vrt-playwright-windows
```

> **Nota:** Como se puede ver en el comando, esta construido para ser ejecutado en una terminal powershell de windows. 

### Revisar el reporte
El reporte se construye en la carpeta llamada [results](https://github.com/AlejandroBlanco2001/GhostE2E/tree/main/rvt-playwright/results), ahí encontrará las imágenes que resultaron de la comparación entre las dos versiones de **Ghost** y una archivo html que contiene el informe con la comparación entre las imágenes.

> Nota: En caso de que el comando anterior falle, se sugiere realizar el proceso como se indica en la siguiente sección.

### Alternativa para ejecutar las pruebas

El script anterior, realiza los siguientes pasos, en caso de que falle, se puede intentar generar de manera manual

Ejecutar las pruebas para ambas versiones de Ghost:
```bash
CI=1 GHOST_VRT=1 GHOST_VERSION=5.96.0 npx playwright test
CI=1 GHOST_VRT=1 GHOST_VERSION=4.5 npx playwright test
```
Una vez se ejecuten las pruebas y se generen las imágenes, se puede ejecutar el siguiente comando para generar el reporte:
```bash
cd rvt-playwright/ && npx tsc && node vrtfile.js
```

Esto generará el reporte en la misma ubicación que se comentó anteriormente.

## Kraken VRT

Siga las instrucciones descritas para correr [Kraken E2E](#kraken-e2e) (**ignorando el paso 3**), y luego:

#### 1. Correr el comando

```bash
npm run execute-vrt-kraken
```

Este comando se encargará de correr Kraken en ambas versiones y realizar el reporte.

#### 2. Acerca del reporte

El reporte se generará en la carpeta: **VRTReport/comparison_report.html**

El reporte será generado con ResembleJS y su lógica se encuentra en el script [vrtRunner.ts](https://github.com/AlejandroBlanco2001/GhostE2E/blob/main/shared/vrtRunner.ts)
