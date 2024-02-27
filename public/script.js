window.onload = function(){

  function updateDOm(){
      let root2 = document.getElementById('root');
      root2.innerHTML = '';
      fetch(`http://localhost:4000/todos`)
      .then(res => res.json())
      .then(data => {
          console.log(data);
          data.forEach((item,index) => {
              let div = document.createElement('div');// $('<div><div>')
              let p = document.createElement('p');
              let deleteBtn = document.createElement('button');
              deleteBtn.innerText = 'x';
              deleteBtn.addEventListener('click',function(){
                  console.log(item.name);
              })
              p.innerText = index + 1 + '.' + item.name;
              p.style.fontSize = '20px';
              p.append(deleteBtn);
              div.append(p);
              root2.append(div);
          })
      })
      .catch(e => console.log(e))
    
      location.reload()
      
  }

  let root = document.getElementById('root2');
  let h1 = document.createElement('h1');
  h1.innerText = "To Do List";
  let input = document.createElement('input');
  input.id = 'input';
  input.placeholder = 'Enter item name';
  let button = document.createElement('button');
  button.innerText = 'Add';
  button.id = 'add';
  root.append(h1);
  root.appendChild(input);
  root.append(button);
  button.addEventListener('click',function(){
      fetch('http://localhost:4000/newitem',{
          headers:{
              'Content-Type':'Application/json'
          },
          method:'POST',
          body:JSON.stringify({item:input.value})
      })
      // update todos
      updateDOm()
  });
  
  let root2 = document.getElementById('root');
  fetch(`http://localhost:4000/todos`)
  .then(res => res.json())
  .then(data => {
      console.log(data);
      data.forEach((item,index) => {
          let div = document.createElement('div');// $('<div><div>')
          div.id = 'todos';
          let p = document.createElement('p');
          let deleteBtn = document.createElement('button');
          deleteBtn.innerText = 'x';
          deleteBtn.addEventListener('click',function(){
              console.log(item.name);
              // delete item
              fetch(`http://localhost:4000/deleteItem`,{
                  headers:{
                      'Content-Type':'Application/json'
                  },
                  method:'post',
                  body:JSON.stringify(item)
              })
              .then(res => {
                  console.log('res---',res.status);
                  if (res.status === 200) {
                      // update dom
                    updateDOm()
                  }
              })
              .catch(e => console.log(e))
              // refresh dom
             
          })
          p.innerText = index + 1 + '.' + item.name;
          p.style.fontSize = '20px';
          // update button
          let updateBtn = document.createElement('button');
          updateBtn.innerText = 'edit';
          updateBtn.addEventListener('click',function(){
              // find input and update value
              document.getElementById('input').value = item.name;
              let editBtn = document.createElement('button');
              editBtn.innerText = 'save';
              document.getElementById('add').style.display = 'none';
              root.append(editBtn);
              editBtn.addEventListener('click',function(){
                  let val = document.getElementById('input').value;
                  fetch(`http://localhost:4000/editItem`,{
                      headers:{
                          'Content-Type':'Application/json'
                      },
                      method:'post',
                      body:JSON.stringify({
                          prevItem:item,
                          newItem:val
                      })
                  }).then((res) => {
                      if (res.status === 200) {
                          updateDOm()
                      }
                  })
                  .catch(e => console.log(e))
              })
          })

          p.append(deleteBtn);
          p.append(updateBtn);
          div.append(p);
          root2.append(div);
      })
  })
  .catch(e => console.log(e))
 }

