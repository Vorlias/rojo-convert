# rojo-convert
A little tool to convert Rojo 0.4.x projects to Rojo 0.5.x

Made this primarily because manually converting `0.4.x` projects to `0.5.x` can be a bit of work.

It's a simple and dirty tool (I wrote this at 4am), but nice and quick at doing the job. The output is based roughly off the example provided [here](https://lpghatguy.github.io/rojo/0.5.x/project-format/#example-projects).

It will convert any non-partition stuff (e.g. `ReplicatedStorage.X.Y.Z` - X and Y will be folders) outside of the services to folders, if there are special cases like `StarterPlayerScripts`, you will need to change the `$className` yourself.

Will be on NPM at some point in the future.
