import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from "d3";
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-imi-dialog-group',
  templateUrl: './imi-dialog-group.component.html',
  styleUrls: ['./imi-dialog-group.component.css']
})
export class ImiDialogGroupComponent {
  @Output() cerrar = new EventEmitter<any>();

  contexto = '';
  preguntas: any = {};
  respuestas: Record<string, Record<string, string>> = {};
  categorias: { key: string; value: any[] }[] = [];

  pasoActual:number = 0;
  cargando = false;
  enviando = false;
  preguntasCargadas = false;
  resumenFinal: any = null;

  textoLibre: Record<string, Record<string, string>> = {};

  frasesCargando: string[] = [
    'La digitalización mejora la eficiencia en todos los niveles.',
    'Establecer procesos estandarizados impulsa la calidad.',
    'Capacitar al personal es clave para la transformación industrial.',
    'Un buen diseño reduce costos desde el inicio.',
    'El uso de sensores permite decisiones más inteligentes.',
    'La trazabilidad en logística mejora la satisfacción del cliente.',
    'La innovación nace de pequeños cambios constantes.',
    'Una organización clara acelera la toma de decisiones.',
    'Gestionar adecuadamente la energía reduce el impacto ambiental.',
    'Documentar procesos permite escalar operaciones con éxito.',
    'Un sistema de información robusto mejora la planificación.',
    'La colaboración entre áreas potencia resultados.',
    'Escuchar al cliente es parte de la mejora continua.',
    'El análisis de datos permite anticipar problemas.',
    'Automatizar tareas repetitivas libera tiempo para innovar.',
    'Invertir en infraestructura digital es invertir en futuro.',
    'La sostenibilidad también es parte de la madurez industrial.',
    'Una buena cultura organizacional acelera el cambio.',
    'La mejora continua debe ser parte del ADN de la empresa.',
    'La digitalización es un camino, no un destino.'
  ];

  fraseActual: string = '';
  intervaloFrases: any;

  cantidadPaginasPreguntas: number = 0;
  cantidadCategoriasPreguntas: number = 0;

  constructor(
    private http: HttpClient,
    private clientService: ClientService
  ) {}

  generarPreguntas(): void {
    this.cargando = true;
    this.iniciarRotacionFrases();

    this.clientService.generarPreguntas(this.contexto).subscribe({
      next: (data) => {
        const preguntas = data.output?.preguntas || {};
        this.preguntas = preguntas;

        this.categorias = Object.keys(preguntas).map(key => ({
          key,
          value: preguntas[key]
        }));

        this.inicializarRespuestas();
        this.preguntasCargadas = true;
        this.cargando = false;
        this.detenerRotacionFrases();
      },
      error: () => {
        alert('Error al generar preguntas');
        this.cargando = false;
        this.detenerRotacionFrases();
      }
    });
  }


  inicializarRespuestas(): void {
    for (const cat of this.categorias) {
      this.respuestas[cat.key] = {};
      for (const pregunta of cat.value) {
        this.respuestas[cat.key][pregunta.pregunta] = '';
      }
    }

  }

  setRespuesta(categoria: string, pregunta: string, opcion: string): void {
    this.respuestas[categoria][pregunta] = opcion;
  }

  todasRespondidas(): boolean {
    for (const cat of this.categorias) {
      for (const pregunta of cat.value) {
        const val = this.respuestas[cat.key][pregunta.pregunta];
        if (!val) return false;
      }
    }
    return true;
  }

  enviarRespuestas(): void {
    if (!this.todasRespondidas()) return;

    const respuestasTransformadas: any = {};

    for (const cat of this.categorias) {
      const catKey = cat.key;
      respuestasTransformadas[catKey] = {};

      for (const pregunta of cat.value) {
        const valor = this.respuestas[catKey]?.[pregunta.pregunta];

        if (valor === '__libre__') {
          const texto = this.textoLibre?.[catKey]?.[pregunta.pregunta]?.trim();
          if (texto) {
            respuestasTransformadas[catKey][pregunta.pregunta] = { libre: texto };
          } else {
            alert(`Por favor completa la respuesta libre en: ${pregunta.pregunta}`);
            return;
          }
        } else {
          const opcionElegida = pregunta.opciones.find(
            (op: { texto: string; puntaje: number }) => op.texto === valor
          );
          if (opcionElegida) {
            respuestasTransformadas[catKey][pregunta.pregunta] = {
              texto: opcionElegida.texto,
              puntaje: opcionElegida.puntaje
            };
          } else {
            respuestasTransformadas[catKey][pregunta.pregunta] = valor;
          }
        }
      }
    }

    const payload = {
      descripcion: this.contexto,
      respuestas: respuestasTransformadas
    };

    this.enviando = true;
    this.iniciarRotacionFrases();

    this.clientService.analizarRespuestas(payload).subscribe({
      next: (data) => {
        this.resumenFinal = data.output;
        this.enviando = false;
        this.detenerRotacionFrases();

        setTimeout(() => {
          this.generarGraficoRadar();
        });
      },
      error: () => {
        this.enviando = false;
        this.detenerRotacionFrases();
        alert('Error al analizar respuestas');
      }
    });
  }



  cerrarPopup(): void {
    if (!this.resumenFinal || !this.resumenFinal.puntajes) {
      this.cerrar.emit(null);
      return;
    }

    const resultado: Record<string, Record<string, number>> = {};

    for (const categoria in this.resumenFinal.puntajes) {
      resultado[categoria] = {};
      for (const sub of Object.keys(this.resumenFinal.puntajes[categoria])) {
        resultado[categoria][sub] = this.resumenFinal.puntajes[categoria][sub].puntaje;
      }
    }

    this.cerrar.emit(resultado);
  }

  keys(obj: any): string[] {
    return Object.keys(obj);
  }

  irAlSiguientePaso(): void {
    if (this.pasoActual < this.categorias.length - 1) {
      this.pasoActual++;
    }
  }

  irAlPasoAnterior(): void {
    if (this.pasoActual > 0) {
      this.pasoActual--;
    }
  }


  usarTextoLibre(cat: string, sub: string): void {
    this.respuestas[cat][sub] = '__libre__';
    if (!this.textoLibre[cat]) this.textoLibre[cat] = {};
    this.textoLibre[cat][sub] = '';
  }

  respuestaLibreActiva(cat: string, sub: string): boolean {
    return this.respuestas[cat]?.[sub] === '__libre__';
  }

  imprimirResumen(): void {
    const contenido = document.getElementById('resumen-pdf')?.innerHTML;
    if (!contenido) return;

    const ventana = window.open('', '_blank', 'width=800,height=1000');
    if (!ventana) return;

    ventana.document.write(`
      <html>
        <head>
          <title>Resumen IMI</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              padding: 30px;
            }

            h3, h4 {
              color: black;
              margin-top: 20px;
            }

            ul {
              margin-bottom: 12px;
              padding-left: 20px;
            }

            li, p {
              page-break-inside: avoid;
              margin-bottom: 8px;
            }

            .acciones-final {
              display: none !important;
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${contenido}
        </body>
      </html>
    `);

    ventana.document.close();
  }




  iniciarRotacionFrases() {
    let index = 0;
    this.fraseActual = this.frasesCargando[index];

    this.intervaloFrases = setInterval(() => {
      index = (index + 1) % this.frasesCargando.length;
      this.fraseActual = this.frasesCargando[index];
    }, 5000);
  }

  detenerRotacionFrases() {
    clearInterval(this.intervaloFrases);
  }

  generarGraficoRadar() {
    const big5Graph = [
      { axis: "Producto", value: this.promedio(["Product","Design","Fabrication"], "Product Management") },
      { axis: "Recursos", value: this.promedio(["Materials","Energy","Logistics"], "Resources Management") },
      { axis: "Informacion", value: this.promedio(["Sensing","Processing","Actuator"], "Information Management") },
      { axis: "Organizacion", value: this.promedio(["Organization","Impact","Compliance"], "Organization Management") },
      { axis: "Innovacion", value: this.promedio(["Innovation","Intellectual property","Training"], "Innovation Management") }
    ];

    // ✅ Usar la misma función de estilos que el padre
    this.drawCustomRadarChartPopup([big5Graph], {
      w: 300,
      h: 300,
      maxValue: 5,
      levels: 5,
      roundStrokes: true,
      color: d3.scaleOrdinal().range(["#64DD17", "#CC333F", "#EDC951"]),
      labelFactor: 1.1,
      wrapWidth: 50,
      opacityArea: 0.35,
      dotRadius: 3,
      opacityCircles: 0.1,
      strokeWidth: 1.5
    });
  }

  promedio(keys: string[], categoria: string): number {
    const puntajes = this.resumenFinal.puntajes[categoria];
    let suma = 0;
    let count = 0;
    keys.forEach(k => {
      if (puntajes[k]) {
        suma += puntajes[k].puntaje;
        count++;
      }
    });
    return count > 0 ? suma / count : 0;
  }

  dibujarRadar(data: any[]) {
    const container = d3.select("#grafico-popup");
    container.selectAll("*").remove(); // limpiar antes de dibujar

    const width = 400, height = 400, maxValue = 5;
    const radius = Math.min(width, height) / 2 - 40;
    const angleSlice = (Math.PI * 2) / data.length;

    const svg = container.append("svg")
      .attr("width", width)
      .attr("height", height);

    const g = svg.append("g")
      .attr("transform", `translate(${width/2},${height/2})`);

    const rScale = d3.scaleLinear().domain([0, maxValue]).range([0, radius]);

    // 🔸 Círculos de niveles
    for (let i=1; i<=5; i++) {
      g.append("circle")
        .attr("r", (radius/5)*i)
        .style("fill", "none")
        .style("stroke", "#ccc");
    }

    // 🔸 Líneas radiales y labels
    data.forEach((d, i) => {
      const angle = angleSlice * i - Math.PI/2;
      g.append("line")
        .attr("x1", 0).attr("y1", 0)
        .attr("x2", rScale(maxValue) * Math.cos(angle))
        .attr("y2", rScale(maxValue) * Math.sin(angle))
        .style("stroke", "#999");

      g.append("text")
        .attr("x", (rScale(maxValue+0.3) * Math.cos(angle)))
        .attr("y", (rScale(maxValue+0.3) * Math.sin(angle)))
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(d.axis);
    });

    // 🔸 Polígono del valor
    const line = d3.lineRadial<any>()
      .radius(d => rScale(d.value))
      .angle((d,i) => i*angleSlice)
      .curve(d3.curveLinearClosed);

    g.append("path")
      .datum(data)
      .attr("d", line)
      .style("fill", "#651fff")
      .style("fill-opacity", 0.3)
      .style("stroke", "#651fff")
      .style("stroke-width", 2);
  }


  drawCustomRadarChartPopup(data: any, cfg: any): void {
    const container = d3.select("#grafico-popup");
    container.selectAll("*").remove(); // ✅ Limpia antes de dibujar

    const maxValue = cfg.maxValue;
    const allAxis = data[0].map((i: any) => i.axis);
    const total = allAxis.length;
    const radius = Math.min(cfg.w / 2, cfg.h / 2);
    const angleSlice = (Math.PI * 2) / total;

    const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

    // ✅ Crear SVG dentro del popup
    const svg = container.append("svg")
      .attr("width", cfg.w + 100)
      .attr("height", cfg.h + 100);

    const g = svg.append("g")
      .attr("transform", `translate(${cfg.w / 2 + 50}, ${cfg.h / 2 + 50})`);

    // 🔹 Glow effect
    const filter = g.append('defs').append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // 🔹 Círculos de fondo
    const axisGrid = g.append("g").attr("class", "axisWrapper");
    axisGrid.selectAll(".levels")
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter().append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d: number) => radius / cfg.levels * d)
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", cfg.opacityCircles)
      .style("filter", "url(#glow)");

    // 🔹 Etiquetas de niveles
    axisGrid.selectAll(".axisLabel")
      .data(d3.range(1, (cfg.levels + 1)).reverse())
      .enter().append("text")
      .attr("class", "axisLabel")
      .attr("x", 4)
      .attr("y", (d: number) => -d * radius / cfg.levels)
      .attr("dy", "0.4em")
      .style("font-size", "10px")
      .attr("fill", "#737373")
      .text((d: number) => d);

    // 🔹 Líneas radiales
    const axis = axisGrid.selectAll(".axis")
      .data(allAxis)
      .enter().append("g")
      .attr("class", "axis");

    axis.append("line")
      .attr("x1", 0).attr("y1", 0)
      .attr("x2", (d: any, i: number) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y2", (d: any, i: number) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("stroke", "white")
      .style("stroke-width", "2px");

    axis.append("text")
      .attr("class", "legend")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("x", (d: any, i: number) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("y", (d: any, i: number) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
      .text((d: unknown) => d as string)
      .call(this.wrap, cfg.wrapWidth);

    // 🔹 Polígono
    const radarLine = d3.lineRadial()
      .curve(d3.curveCardinalClosed)
      .radius((d: any) => rScale(d.value))
      .angle((d: any, i: number) => i * angleSlice);

    const blobWrapper = g.selectAll(".radarWrapper")
      .data(data)
      .enter().append("g")
      .attr("class", "radarWrapper");

    blobWrapper.append("path")
      .attr("class", "radarArea")
      .attr("d", (d: any) => radarLine(d))
      .style("fill", (d: any, i: any) => cfg.color(i))
      .style("fill-opacity", cfg.opacityArea);

    blobWrapper.append("path")
      .attr("class", "radarStroke")
      .attr("d", (d: any) => radarLine(d))
      .style("stroke-width", cfg.strokeWidth + "px")
      .style("stroke", (d: any, i: any) => cfg.color(i))
      .style("fill", "none")
      .style("filter", "url(#glow)");

    blobWrapper.selectAll(".radarCircle")
      .data((d: any) => d)
      .enter().append("circle")
      .attr("class", "radarCircle")
      .attr("r", cfg.dotRadius)
      .attr("cx", (d: any, i: number) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr("cy", (d: any, i: number) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
      .style("fill", (d: any, i: any, j: any) => cfg.color(j))
      .style("fill-opacity", 0.8);
  }

  // ✅ Misma función wrap que el padre
  wrap(text: any, width: any): void {
    text.each((d: any, i: any, nodes: any) => {
      let textSel = d3.select(nodes[i]),
        words = textSel.text().split(/\s+/).reverse(),
        line: string[] = [],
        lineNumber = 0,
        lineHeight = 1.4,
        y = textSel.attr("y"),
        x = textSel.attr("x"),
        dy = parseFloat(textSel.attr("dy")),
        tspan = textSel.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

      let word;
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node()!.getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = textSel.append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }


}
