return function(a){var b=new Battle.Room(a,1,2);new Battle.ItemPickup(b,"wrench");var c=new Battle.Room(a,1,1);new Battle.ExteriorDoor(c,"right",null);var d=new Battle.Room(a,0,1);new Battle.Ledge(c,d);var e=new Battle.Room(a,-1,1);new Battle.ExteriorDoor(e,"left",null,"tutorial/combat"),new Battle.Path(c,b),new Battle.InteriorDoor(d,e);var f=new Battle.Room(a,-1,0);new Battle.Path(e,f);var g=new Battle.Room(a,-1,-1);new Battle.Path(f,g);var h=new Battle.Room(a,0,-1);new Battle.Path(g,h);var i=new Battle.Room(a,1,-1);new Battle.Path(h,i);var j=new Battle.Room(a,1,0);new Battle.Ledge(c,j),new Battle.Path(i,j),new Battle.Decoration(g,"top","window"),new Battle.Decoration(h,"top","window"),new Battle.Decoration(i,"top","window"),new Battle.EnemySpawnPoint(e),new Battle.EnemySpawnPoint(e),new Battle.EnemySpawnPoint(e),new Battle.EnemySpawnPoint(e),new Battle.EnemySpawnPoint(e),a.tilesetName="leviathan"};