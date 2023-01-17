# CENTROGEOMAPARESIDENCIA
Mapa hecho en centro geo
Este mapa se trabajo con las librerias y APIS de leaflet, overpass y google maps.
Cosas a considerar:
La licencia actual de google maps consta de 3 meses apartir del 15 de enero 2022, por lo que se recomienda cambiarla cada 3 meses o por defecto comprarla
Para trabajar en forma local(como esta en este momento el proyecto en el repositorio) debemos descargar tal cual el proyecto y usar los programas:
algun manejador de hiper texto en este caso de uso visual estudio y algun gestor de base de datos se uso Xampp y phpmyadmin.
Primeramente instalamos la base de datos la cual esta en los archivos llamada geomap.SQL la cual tiene por usuario y contraseña geomap.
Consta con la configuracion de autoborrado de los datos, en caso de no tenerlos en phpmyadmin activarlo en el reloj.
Posteriormente iniciamos el servidor local y si esta puesta en su carpeta por defecto accedemos directamente al proyecto, en caso de no hacerlo nos dirijimos a la ruta:
        C:\xampp\apache\conf\extra
        donde buscaremos el archivo:
httpd-vhosts.conf
 y ahi en la linea 44 dejamos de esta forma:
 <VirtualHost *:80>
    ##ServerAdmin webmaster@dummy-host2.example.com
    # DocumentRoot "C:/xampp/htdocs/CURSOPHP"
#    DocumentRoot "C:/xampp/htdocs/cetis"
    # DocumentRoot "C:/xampp/htdocs/"
     DocumentRoot "C:/xampp/htdocs/geomap" # --------- ruta del documento
    ServerName localhost
    ##ErrorLog "logs/dummy-host2.example.com-error.log"
    ##CustomLog "logs/dummy-host2.example.com-access.log" common
</VirtualHost>

Posteriormente ya con la base de datos funcionando y el codigo correctamente configurado el proyecto trabajara sin ningun problema.
Se baso en la API de leaflet para la consultas las cuales fueron investigadas para aplicarlas en una sola global para posteriormente enlistarlas y trabajar con ellas.
El mapa esta basado en leaflet el cual nos permite interactuar con la diversidad de configuraciones y capas.
Con la api de google podemos obtener una gran cantidad de informacion relevante para el proyecto como lo son las horas e importancia de un lugar.
GRACIAS!.
