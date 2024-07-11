# 28/06/24 mramirez
- Se encontró que varios elementos del material-angular estaban sin funcionar, esto se debe a que se siguen usando las librerias antiguas
- Para corregir los problemas de los mat-slider de la vista /dashboard se importo el módulo MatSliderModule en el modulo de app-material
- Los sliders en angular 16 funcionan distinto, es necesario agregar a cada uno un input dentro con las propiedades "matSliderThumb [(ngModel)]"

#11/07/24 mramirez
- Se cambio algunas librerias legacy que no renderizaban correctamente debido al cambio de etiquetas y modulo a llamar
- Se cambio los chips para que vuelvan a funcionar, antes se usaba "mat-chip-list" y "mat-chip" ahora se usa "mat-chip-grid" y "mat-chip-row" según la documentación de migración de angular 15 a 16
- Se agregó colores rojo y amarillo a los desplegables del dashboard para reconocer que color va con el grafíco correspondiente
- Se centró el gráfico y se dió mas espacio a los desplegables para que pueda entrar los textos

