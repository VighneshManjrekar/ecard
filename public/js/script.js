const s = (id) => {
    return document.querySelector(`${id}`)
}

document.querySelectorAll('.small-img').forEach(img => {
    img.addEventListener('click', () => {
        const imgName = img.getAttribute('alt');
        console.log(imgName)
        s('#main-img').src = `${imgName}`;
    })
})
s(".send-mail-btn").addEventListener('click',()=>{
    s("#mail-img").value = s('.img-thumbnail').src
})
// console.log()
// s('#mail-img').value = 