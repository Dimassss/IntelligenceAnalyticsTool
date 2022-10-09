Plugins
=======

axios.ts
--------
Here is exported configured axios object to make request to database.


axiosAuth.ts
------------
Here is exported configured axios object to make request to database with jwt tokens.
If jwt token is expired, this axios object will automaticly try to refresh jwt token.
If refresh jwt token is also expired, so you will be automaticly redirected to `/signin` page