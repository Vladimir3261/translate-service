# Translation services server
REST API + administration interface for use several account
 across many translation services. Auto switch accounts and services while limits is reached.
### Services:
 - Google translate API
 - Microsoft Azure translation API
 - Yandex Translate API.
 
 ## Installation:
 1.  Clone this repo
 2.  Edit `.env` file:
 3. Run docker container:
 
 ```$xslt
docker-compose up -d
```

Configuration (.env):
 ```
 REDIS_HOST=redis
 REDIS_PORT=6379
 SQLITE_DB=translate.db
 HTTP_PORT=5000
 ```
 
 
`REDIS_HOST` and `REDIS_PORT` - If you use your own redis (outside of docker container)

`SQLITE_DB` - SQLite database name that will be created on start of containers, leave this empty if you want to use in-memory sqlite database

** Note: in memory database will be destroyed on shutdown docker container and created again while it starts
   to keep your settings outside docker use named database and share it to your local filesystem as volume

`HTTP_PORT` - port where your http server with API will be started.

### REST API endpoints:

```POST /translate``` - Request translation:

```json
{
  "text": "Hola",
  "targetLanguage": "EN",
  "sourceLanguage": "ES"
}
```

Response:

```json
{
    "sourceLanguage": "ES",
    "targetLanguage": "EN",
    "sourceText": "Hola",
    "translatedText": "Hello",
    "translationService": "Google"
}
```

#### System management endpoints

``GET /services`` - services list

``GET /services/:id`` - detailed info by specified service

``GET /providers`` - get available providers (Translation services)

``POST /services`` - Create new service

```json
  {
  	"name": "Google translate service Account #4",
  	"credentials": "api_key",
  	"limit": 15000000,
  	"provider": 1
  }
```

``PUT /services/:id`` - Edit service (Request body same as POST)

``DELETE /services/:id`` - Remove service by id

``GET /stats`` - Current system  and services status.
