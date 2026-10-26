const Box = document.getElementById("box")

const data = async()=>{
    try{
    const proses = await fetch('https://dummyjson.com/products');
    const dataJson = await proses.json()
    Box.innerHTML = dataJson.products.map(testing=> `
    <h1>nama produk ${testing.title}</h1>
    `)
}
catch{
 console.log("error")
}
}
data()