# 28/06/24 mramirez
- Se encontró que varios elementos del material-angular estaban sin funcionar, esto se debe a que se siguen usando las librerias antiguas
- Para corregir los problemas de los mat-slider de la vista /dashboard se importo el módulo MatSliderModule en el modulo de app-material
- Los sliders en angular 16 funcionan distinto, es necesario agregar a cada uno un input dentro con las propiedades "matSliderThumb [(ngModel)]"