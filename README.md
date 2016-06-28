# server_depart
Serveur d'API open data

## Modifs faites pour que çà marche :
* création à la main de l'adresse 94.23.176.119 : https://www.a2hosting.com/kb/a2-hosting-products/cloud-vps-hosting/configuring-additional-ip-addresses-on-a-cloud-vps
* modification d'apache pour n'ecouter que l'adresse principale : /etc/apache2/ports.conf
* installation libcap2.bin : https://www.digitalocean.com/community/tutorials/how-to-use-pm2-to-setup-a-node-js-production-environment-on-an-ubuntu-vps
* creation service node_depart (on aurait pu utiliser pm2)

## Todo
- resultat détaillé par BV
- liste candidats du canton
- nettoyer les log
