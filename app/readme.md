### Slimebike App 

* To run the app - `npm run start`. 
* First test in dev, then in staging and then in production.
* Merge master in staging and verify it works and then just `git pull` on production. 

#### To get development setup on a new machine (assuming Ubuntu 20.04)

* Install NodeJS as described [here](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-20-04).
* Install Postgres 12  as described [here](https://www.digitalocean.com/community/tutorials/how-to-install-postgresql-on-ubuntu-20-04-quickstart) and setup the user postgres and a database user with write permissions. 
* Install PostGIS ([instructions](https://computingforgeeks.com/how-to-install-postgis-on-ubuntu-debian/)) and pgRouting ([instructions](https://docs.pgrouting.org/3.0/en/pgRouting-installation.html)). 
* Install pgAdmin as described [here](https://computingforgeeks.com/how-to-install-pgadmin-4-on-ubuntu/).
* Install flyway as described [here](https://flywaydb.org/documentation/commandline/). 
* Apply the database migrations as described in the database documentation [here](https://dbdocs.io/chintanp/Slimebike). 
* Install all the node modules using `npm install`. 
* Rename `.env-sample` in this directory to `.env` and add the values. 
* Setup AWS credentials. 