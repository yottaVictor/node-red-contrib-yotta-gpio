
Introduction
------------

This Node-RED module provides a collection of custom nodes for communicating with distributed controllers and communication modules produced by [**Yottacontrol Co.**](https://www.yottacontrol.com.tw/h/index?key=x9ic2). These nodes allow you to easily read from and write to various digital and analog inputs/outputs over Modbus using Node-RED.



## Features

- **Read Nodes:** Read data from Digital Input (DI), Digital Output (DO), Analog Input (AI), and Analog Output (AO) pins.
- **Write Nodes:** Write data to DO and AO pins.
- Works with Modbus-compatible YottaControl modules.
- Designed to work in conjunction with the `Modbus-Flex-Getter` and `Modbus-Flex-Write` nodes provided by `node-red-contrib-modbus`

![YottaControl Node-RED Banner](/snapshot.png)


## Nodes Included

### Read Nodes

- `Read_DI`
- `Read_DO`
- `Read_AI`
- `Read_AO`

These nodes are used to read data from YottaControl modules. The output is passed in `msg.payload`. When reading more than one point, `msg.payload` should be an array.

### Write Nodes

- `Write_DO`
- `Write_AO`

These nodes send data to YottaControl modules. You need to configure:
- **Model type** (e.g., Yotta I/O module model)
- **Output pin**  (The specific digital or analog output pin on the Yotta module to which data will be sent)
- **Modbus ID**  (The unique address assigned to the Yotta module on the Modbus network, used for communication)
- **Quantity**   (The number of consecutive registers or outputs to be written, depending on the module type)

## Read Mode

### DI/DO

```javascript
 { value: msg.payload, 'fc': 1, 'unitid': 1, 'address': 0 , 'quantity': 1 } 
```
### AI/AO
```javascript
 { value: msg.payload, 'fc': 3, 'unitid': 1, 'address': 0 , 'quantity': 1 } 
```

## Write node

### DO
```javascript
{value: msg.payload, 'fc': 5, 'unitid': 1, 'address': 0 , 'quantity': 1}
```

### AO
```javascript
{value: msg.payload, 'fc': 6, 'unitid': 1, 'address': 0 , 'quantity': 1}
```

## Usage Tips

- Ensure all required fields are filled; otherwise, message construction may fail.
- When reading multiple channels, make sure `msg.payload` is in array format.
- Make sure Modbus ID and address correspond correctly with your hardware.

