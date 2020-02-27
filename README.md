# Bachelor Thesis Project Demo

This project represents the front end part of the bachelor thesis project which represents a descentralized demand-response program for smart grids implemented with Ethereum technology. It allows easy interaction, addition, removal and vizualization of the nodes present in the network in order for a smooth simulation. 

## Usage

First, the Ethereum part of the project has to be deployet on the test network, and the server which will make the connection with the browser and blockchain has to be deployed. 

After running `ng server` the simulator can be accessed in the browser on `http://localhost:4200` after which the start page will be shown:

![Image of Yaktocat](https://i.imgur.com/vkKbnbm.png)

To add a new producer node the information about it has to be inserted on step 1, after which a suggested production curve can be chosen from the dropdown in the step 2. After choosing a production curve, it will be shown and the user can manipulate each value by drag and drop on the curve points. To finalize the creation of the node the Add Producer button has be pressed in step 3. On step 4 the process of creating a consumer is identical to the one just mentioned. 

After adding all the nodes, the network would be similar to the following one. 

![Image of Yaktocat](https://i.imgur.com/g09lH0n.png)

Before starting the simmulation, the consumption curves of the whole system can be visualized on step 1, while step 2 shows the network topology. Step 3 finally starts the simmulation, after which the user can view and insert production/consumption values by clicking on the nodes. 


## Deployment

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.
