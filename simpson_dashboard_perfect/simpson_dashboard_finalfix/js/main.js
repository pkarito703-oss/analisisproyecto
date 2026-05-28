let animacionCarro = null;

function calcular(){

    try{

        let funcionTexto =
        document.getElementById("funcion").value;

        let a = math.evaluate(
        document.getElementById("a").value);

        let b = math.evaluate(
        document.getElementById("b").value);

        let n = parseInt(
        document.getElementById("n").value);

        if(n % 2 !== 0){

            alert("n debe ser par");
            return;
        }

        let h = (b-a)/n;

        const funcion =
        math.compile(funcionTexto);

        // =========================
        // CUARTA DERIVADA
        // =========================

        const cuartaDerivada =
        math.derivative(

            math.derivative(

                math.derivative(

                    math.derivative(
                        funcionTexto,
                        'x'
                    ),

                    'x'
                ),

                'x'
            ),

            'x'
        );

        let suma = 0;

        let tabla = `
        <h2>
        <i class="fa-solid fa-road"></i>
        Resultados del Viaje
        </h2>

        <table>

        <tr>
            <th>i</th>
            <th>x</th>
            <th>f(x)</th>
        </tr>
        `;

        let errorTabla = `
        <h2>
        <i class="fa-solid fa-triangle-exclamation"></i>
        Tabla de Error
        </h2>

        <table>

        <tr>
            <th>Intervalo</th>
            <th>Punto Medio</th>
            <th>f4(xn)</th>
        </tr>
        `;

        let xGrafica = [];
        let yGrafica = [];

        let sumatoria = 0;

        // =========================
        // TABLA PRINCIPAL
        // =========================

        for(let i=0; i<=n; i++){

            let x = a + i*h;

            let fx =
            funcion.evaluate({x:x});

            xGrafica.push(x);
            yGrafica.push(fx);

            tabla += `
            <tr>
                <td>${i}</td>
                <td>${x.toFixed(4)}</td>
                <td>${fx.toFixed(4)}</td>
            </tr>
            `;

            if(i==0 || i==n){

                suma += fx;
            }

            else if(i%2==0){

                suma += 2*fx;
            }

            else{

                suma += 4*fx;
            }
        }

        // =========================
        // TABLA DE ERROR
        // =========================

        for(let i=0; i<n; i++){

            let x1 = a + (i*h);

            let x2 = x1 + h;

            let xm = (x1+x2)/2;

            // evaluar cuarta derivada
            let valorCuarta =
            cuartaDerivada.evaluate({
                x:xm
            });

            sumatoria += valorCuarta;

            errorTabla += `
            <tr>

                <td>
                [${x1.toFixed(4)}, ${x2.toFixed(4)}]
                </td>

                <td>
                ${xm.toFixed(4)}
                </td>

                <td>
                ${valorCuarta.toFixed(4)}
                </td>

            </tr>
            `;
        }

        tabla += `</table>`;

        let resultado =
        (h/3)*suma;

        // =========================
        // FORMULA DEL ERROR
        // =========================

        let ET = (

            -(
                Math.pow((b-a),5)
                /
                (
                    180 *
                    Math.pow(n,5)
                )
            )

        ) * sumatoria;

        tabla += `
        <div class="resultadoFinal">
            ${resultado.toFixed(4)} Litros
        </div>
        `;

        errorTabla += `
        </table>

        <div class="resultadoFinal">
            Sumatoria: ${sumatoria.toFixed(4)}
        </div>

        <div class="resultadoFinal">
            ET: ${ET.toFixed(4)}
        </div>
        `;

        document.getElementById("resultado")
        .innerHTML = tabla;

        document.getElementById("tablaError")
        .innerHTML = errorTabla;

        // =========================
        // BARRA DE COMBUSTIBLE
        // =========================

        let porcentaje =
        Math.min(resultado * 8,100);

        document.getElementById("progreso")
        .style.width = porcentaje + "%";

        // =========================
        // GRAFICA
        // =========================

        let datos = [{

            x:xGrafica,

            y:yGrafica,

            fill:'tozeroy',

            fillcolor:'rgba(59,130,246,0.3)',

            type:'scatter',

            mode:'lines+markers',

            line:{
                color:'#60a5fa',
                width:5
            },

            marker:{
                color:'#ffffff',
                size:8
            }

        }];

        let layout = {

            title:'Área Bajo la Curva',

            paper_bgcolor:'rgba(0,0,0,0)',

            plot_bgcolor:'rgba(0,0,0,0)',

            font:{
                color:'white'
            }

        };

        Plotly.newPlot(
        'grafica',
        datos,
        layout);

        moverCarro(xGrafica,yGrafica);

    }

    catch(error){

        alert(
        "Error en los datos ingresados");

        console.log(error);
    }
}

function moverCarro(x,y){

    const carro =
    document.getElementById("carroGrafica");

    if(animacionCarro){

        clearInterval(animacionCarro);
    }

    const grafica =
    document.getElementById("grafica");

    const ancho =
    grafica.offsetWidth;

    const alto =
    grafica.offsetHeight;

    const maxY =
    Math.max(...y);

    let index = 0;

    animacionCarro = setInterval(()=>{

        if(index >= x.length){

            index = 0;
        }

        let posX =
        (index/(x.length-1))
        * (ancho - 120);

        let posY =
        alto -
        ((y[index]/maxY)
        * (alto - 180));

        carro.style.left =
        (posX + 60) + "px";

        carro.style.top =
        (posY + 30) + "px";

        index++;

    },700);

}