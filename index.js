var express = require('express');
var http = require('http');
var fs = require('fs');
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);
const port = process.env.PORT || 3000;
///express
app.get('/', (req, res) => 
{
  res.render('index.ejs');
});
app.get('/set', (req, res) => 
{
  res.render('settings.ejs');
});
///variables
var saves = {};
saves = JSON.parse(fs.readFileSync('saves_sph.json')); console.log(saves);
var online = 0;
users_id = [];
connections = [];
var dd = [];
///socket.io
io.sockets.on('connection', (socket) => 
{
  console.log("User " + socket.id + " was connected");
  connections.push(socket);
  fs.writeFileSync('dd.json', JSON.stringify(dd));
  io.sockets.emit('online', connections.length);
  socket.on('disconnect', (data) => {
    io.sockets.emit('online', connections.length);
    users_id.splice(users_id.indexOf(users_id[connections.length - 1]), 1);
    connections.splice(connections.indexOf(socket), 1);
  });
  ///android
  socket.on('android', m => 
  {
    console.log(m);
  });
  ///canvas_width
  socket.on('canvas_width', w => 
  {
    io.sockets.emit('canvas_width', w);
  });
  ///s
  socket.on('s_sph0', s => 
  {
    io.sockets.emit('s_sph0', s);
  });
  socket.on('s_sph1', s => 
  {
    io.sockets.emit('s_sph1', s);
  });
  socket.on('s_sph2', s => 
  {
    io.sockets.emit('s_sph2', s);
  });
  ///w
  socket.on('w_sph0', w => 
  {
    io.sockets.emit('w_sph0', w);
  });
  socket.on('w_sph1', w =>
  {
    io.sockets.emit('w_sph1', w);
  });
  socket.on('w_sph2', w => 
  {
    io.sockets.emit('w_sph2', w);
  });
  ///arc
  socket.on('r_color_arc', c_r => 
  {
    io.sockets.emit('r_color_arc', c_r);
  });
  socket.on('g_color_arc', c_g => 
  {
    io.sockets.emit('g_color_arc', c_g);
  });
  socket.on('b_color_arc', c_b => 
  {
    io.sockets.emit('b_color_arc', c_b);
  });
  ///clear_canvas
  socket.on('clear_canvas', () => 
  {
    io.sockets.emit('clear_canvas');
  });
  ///btn_stop
  socket.on('btn_stop', bool => 
  {
    io.sockets.emit('btn_stop', bool);
  });
  ///skeleton_and_background
  socket.on('skeleton', bool => 
  {
    io.sockets.emit('skeleton', bool);
    console.log(bool);
  });
  socket.on('color_canvas', (c_r, c_g, c_b) => 
  {
    io.sockets.emit('color_canvas', c_r, c_g, c_b);
  });
  ///new_save
  socket.on('new_save', (name, arc, sph0, sph1, sph2) => 
  {
    saves[`${name}`] = 
    {
      arc: arc,
      sph0: sph0,
      sph1: sph1,
      sph2: sph2,
    }
    fs.writeFileSync('saves_sph.json', JSON.stringify(saves));
    io.sockets.emit('all_saves', JSON.parse(fs.readFileSync('saves_sph.json')));
  });
  socket.on('send_me_saves', () => 
  {
    io.sockets.emit('all_saves', JSON.parse(fs.readFileSync('saves_sph.json')));
  });
  ///delete_save
  socket.on('btn_saves_delete', save => 
  {
    delete saves[save];
    fs.writeFileSync('saves_sph.json', JSON.stringify(saves));
    io.sockets.emit('all_saves', JSON.parse(fs.readFileSync('saves_sph.json')));
  });
  ///rename_save
  socket.on('rename_save', (name, deferName) => 
  {
    saves[name] = saves[deferName];
    delete saves[deferName];
    fs.writeFileSync('saves_sph.json', JSON.stringify(saves));
    io.sockets.emit('all_saves', JSON.parse(fs.readFileSync('saves_sph.json')));
  });
  ///visual_sockets
  socket.on('btn_background', bool => 
  {
    socket.broadcast.emit('btn_background', bool);
  });

});

server.listen(port);
