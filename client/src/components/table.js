

export default function Table(props){
  return(
      <div class="grid">
        {props.items.map((e, index) => <TableItem item={e} action={props.action} index = {index}></TableItem>)}
      </div>
  )
}

function TableItem({item, action}){
  let image;
  if (item.images.size > 1){
    image = item.images[1].url;
  }
  else{
    image = item.images[0].url;
  }
  return (
    <div 
      class="card"
      onClick={() => action(item.id,item.name,image)}
      style={{backgroundImage: `url(${image})`}}
    >
    </div>
  )
}
