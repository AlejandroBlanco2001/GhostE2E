import { readFileSync, writeFileSync, readdirSync, statSync} from 'fs';
import pixelmatch, { PixelmatchOptions } from 'pixelmatch';
import { PNG } from 'pngjs';
import { join } from 'path'


function pixelRunner(){

    compareScreenshots();
    const reportPath = './report.html'
    writeFileSync(reportPath, createReport());
    console.log(`Consulte el Reporte en: ${reportPath}`);
};


type escenario = {
    nombre: string;
    descripcion: string;
    path: string;
    screenshots: string[];
}


const escenarios: escenario[] = [
    {
        nombre: "LOGIN",
        descripcion: "Antes de ejecutar cada escenario de prueba, se ingresan las credenciales para poder acceder a la aplicación en modo administrador",
        path: "EP014 Check new page is visible in Pages Editor",
        screenshots: ["Login"]
    },
    {
        nombre: "EP006",
        descripcion: "Al crear un miembro debe quedar registrado en la tabla de miembros del sitio. este debería ser creado de manera satisfactoria y debería verse en el listado de miembros.	",
        path: "EP006 Create member",
        screenshots: ["Login", "Members Page", "Create Member", "Member Created", "Members Page"]
    },
    {
        nombre: "EP007",
        descripcion: "Al crear un miembro sin nombre, este debe guardarse satisfactoriamente, y en el listado debe salir su correo electrónico como su nombre.	",
        path: "EP007 Create member with same name",
        screenshots: ["Login", "Members Page", "Create Member", "Member Created", "Members Page"]
    },
    {
        nombre: "EP008",
        descripcion: "Al crear un miembro sin nombre, este debe guardarse satisfactoriamente, y en el listado debe salir su correo electrónico como su nombre.	",
        path: "EP008 Create member without name",
        screenshots: ["Login","Member Created", "Create Member", "Member Created"]
    },
    {
        nombre: "EP009",
        descripcion: "Al crear un miembro con un correo electrónico invalido, este debe no ser creado y no visualizarse en la lista.",
        path: "EP009 Create member with invalid email",
        screenshots: ["Login","Member Not Created", "Create Member", "Member Not Created"]
    },
    {
        nombre: "EP010",
        descripcion: "Al editar un miembro existente, este debe ver sus cambios reflejados en la tabla de miembros.",
        path: "EP010 Edit member",
        screenshots: ["Login","Members Page","Create Member", "Member Created"]
    },
    {
        nombre:"EP013", 
        descripcion:"Tras crear una página nueva, se debe poder navegar a su url.",
        path: "EP013 Check new page are created",
        screenshots: ["Login", "Post List", "Page Created", "Access Page Created"]
    },
    {
        nombre:"EP014", 
        descripcion:"Tras crear una nueva página, esta debe aparecer en el menú del editor",
        path: "EP014 Check new page is visible in Pages Editor",
        screenshots: ["Login", "Post List", "Page Created", "Pages menu"]
    },
    {
        nombre:"EP016", 
        descripcion:"Se realiza la creación de un nuevo tag asignando solamente un nombre válido y este debe poder ser guardado de forma exitosa.",
        path: "EP016 - Verify create new @Tag",
        screenshots: ["Login", "Tag Page", "Tag Created"]
    },
    {
        nombre:"EP017", 
        descripcion:"Se realiza el proceso de creación de un nuevo tag sin asignarle un nombre al mismo y se intenta guardar, esperando que la aplicación muestre que hay un error en la creación del tag.",
        path: "EP017 - Verify @Tag should have a name",
        screenshots: ["Login", "Tag Page", "Tag Create Error"]
    },
    {
        nombre:"EP018", 
        descripcion:"Se realiza el proceso de creación de un tag, asignando un nombre válido y una descripción que supere el límite de caracteres permitidos, se espera que la aplicación indique que no se puede crear el tag.",
        path: "EP018 - Verify tag description limit",
        screenshots: ["Login", "Tag Page", "Tag Create Error"]
    },
    {
        nombre:"EP019", 
        descripcion:"Se realiza el proceso de creación de un tag, asignando un nombre válido y un 'slug' que supere el límite de caracteres permitidos, se espera que la aplicación indique que no se puede crear el tag.",
        path: "EP019 - Verify tag slug limit",
        screenshots: ["Login", "Tag Page", "Tag Saved"]
    },
    {
        nombre:"EP020", 
        descripcion:"Se realiza el proceso de creación de un tag interno para Ghost, con la información válida para su creación, se espera que el tag se liste en la sección que muestra el listado de tags internos.",
        path: "EP020 - Verify internal tag creation",
        screenshots: ["Login", "Tag Page","Tag Created","Internal page"]
    },
]


function compareScreenshots() {
    const options: PixelmatchOptions = {
        "threshold": 0.1,
        "includeAA": true,
        "alpha": 0.1,
        "aaColor": [255, 0, 0],
        "diffColor": [255, 0, 255]
    }

    for (let e = 0; e < escenarios.length; e++) { 
        const escenario = escenarios[e]; 
        const referenceRoot = "../screenshots/playwright/4.5/";
        const testRoot = "../screenshots/playwright/5.96.0/";

        try {
            if (escenario) {
                for (let c=0; c < escenario.screenshots.length; c++){
                    const screenshot = escenario.screenshots[c];
                    if (screenshot) {
                        let dirReference = referenceRoot + "/" + escenario.path;
                        let refencePath = obtenerPorNombre(dirReference,screenshot);
                        let dirTest = testRoot + "/" + escenario.path
                        let testPath = obtenerPorNombre(dirTest,screenshot);                 
    
                        const img1 = PNG.sync.read(readFileSync(refencePath));
                        const img2 = PNG.sync.read(readFileSync(testPath));
                    
                        const { width, height } = img1;
                        const diff = new PNG({ width, height });
                    
                        pixelmatch(img1.data, img2.data, diff.data, width, height, options);
    
                        let n = c+1
                        const diffPath = "./results/" + escenario.nombre + "_" + n + ".png";
                        writeFileSync(diffPath, PNG.sync.write(diff));
    
                    }
                }
            }
        }catch (error) {
            console.error("Error al comparar las imagenes: ", error);
            continue;
        }    
    }
}

function obtenerPorNombre(directorio: string, nombre:string): string {

    const contenido = readdirSync(directorio);
    const archivos = contenido.filter((elemento) => {
        const rutaCompleta = join(directorio, elemento);
        return statSync(rutaCompleta).isFile();
    });

    for (const archivo of archivos) {
        const rutaCompleta = join(directorio, archivo);
        if (archivo.includes(nombre)) {
            return rutaCompleta;
        }
    }

    console.log("No existe: " + nombre + " en " + directorio);
    return "No Existe";
}

function createReport(){
    let reportHtml =`
    <html>
        <head>
            <title> VRT Report </title>
            <link href="index.css" type="text/css" rel="stylesheet">
        </head>
        <body>
            <h1>Reporte VRT PixelMatch</h1>
            <h2>Aplicación Base: Ghost 4.5</h2>
            <h2>Aplicación Bajo Pruebas: Ghost 5.96.0</h2>`;
    
    for(let e=0; e< escenarios.length; e++){
        const escenario = escenarios[e];
        if(escenario){
            reportHtml += divEscenario(escenario);
        }
    }
    
            
    reportHtml +=`
        </body>
    </html>`;
    return reportHtml;
}

function divEscenario(esc: escenario): string {
    
    const nombre = esc.nombre
    const descripcion = esc.descripcion
    let htmlEscenario = `
            <div style="background-color:whitesmoke; margin-bottom:100;"}>
                <div style="background-color:purple; color: white; text-align: center;">
                    <h2>${nombre}</h2>
                </div>
                <p style="text-align:center; font-size: 1.4rem;"><span style="font-weight: bold;">Descripción:</span> ${descripcion}</p>`

    const referenceRoot = "../screenshots/playwright/4.5/";
    const testRoot = "../screenshots/playwright/5.96.0/";

    for(let i = 0; i < esc.screenshots.length; i++){
        let screenshot = esc.screenshots[i];
        if(screenshot){
            let dirReference = referenceRoot + "/" + esc.path;
            let refencePath = obtenerPorNombre(dirReference,screenshot);
            let dirTest = testRoot + "/" + esc.path
            let testPath = obtenerPorNombre(dirTest,screenshot); 
            let n = i+1
            let diffPath = "./results/" + esc.nombre + "_" + n + ".png"
            htmlEscenario += 
            `
            <h3 style="text-align:center;">${screenshot}</h3>
                <div style="display:flex">
                    <div style="text-align: center;">
                        <h4>Referencia</h4>
                        <img src =  '${refencePath}' style='width:100%;'>
                    </div>
                    <div style="text-align: center;">
                        <h4>Test</h4>
                        <img src = '${testPath}' style='width:100%;'>
                    </div>
                    <div style="text-align: center;">
                        <h4>Diferencia</h4>
                        <img src = '${diffPath}' style='width:100%;'>
                    </div>
                </div>`
        }
    }

    htmlEscenario +=`</div>`
  
    return htmlEscenario;
}


pixelRunner();
