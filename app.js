const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images 
const showImages = (images) => {
  if(images.length==0){
    noResultFound();
  }
  else{
    imagesArea.style.display = 'block';
    gallery.innerHTML = '';
    // show gallery title
    galleryHeader.style.display = 'flex';
    images.forEach(image => {
      let div = document.createElement('div');
      div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2 image';
      // let imgDiv=document.createElement('div');
      // imgDiv.innerHTML = ` <img class="img-fluid img-thumbnail height" onclick="selectItem(event,'${image.webformatURL}')" src="${image.webformatURL}" alt="${image.tags}">`;
      // let hoverDiv=document.createElement('div');
      // hoverDiv.className="hover-info"
      // hoverDiv.innerHTML=`<div class="download-like"><div><i class="fas fa-download"></i>${image.downloads}</div><div > <i class="margin-left fas fa-thumbs-up"></i>${image.likes}</div></div>`
      // let tagDiv=document.createElement('div');
      // tagDiv.innerHTML=`  # ${image.tags}`;
      // div.appendChild(imgDiv);
      // div.appendChild(hoverDiv);
      // div.appendChild(tagDiv);

      const insideDiv=`
      <div onclick="selectItem(event,'${image.webformatURL}')">
        <div>
          <img class="img-fluid img-thumbnail height"  src="${image.webformatURL}" alt="${image.tags}">
        </div>
        <div class="hover-info ">
          <div class="download-like">
            
              <i class="fas fa-download"></i>${image.downloads}
              <i class="margin-left fas fa-thumbs-up"></i>${image.likes}
           
          </div>
        </div>
        <div class="text-align">
          #${image.tags}
        </div>
      </div>
      `
      div.innerHTML=insideDiv;
      gallery.appendChild(div);
    })
  }
}

const getImages = (query) => {
  fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => showImages(data.hits))
    .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  
  let item = sliders.indexOf(img);
  if(event.path[0].className=="download-like"){
    if (item === -1) {
      event.path[2].classList.toggle('added');
      
      sliders.push(img);
      
    } else {
      const newSlider=sliders.filter(element=>element!=img);
      sliders=[];
      sliders=newSlider;
      event.path[2].classList.toggle('added');
    }
    
  }
  else if(event.path[0].className=="fas fa-download"){
    if (item === -1) {
      event.path[3].classList.toggle('added');
      sliders.push(img);
    } else {
      const newSlider=sliders.filter(element=>element!=img);
      sliders=[];
      sliders=newSlider;
      event.path[3].classList.toggle('added');
    }

  }
  else{
    if (item === -1) {
      event.path[1].classList.toggle('added');
      
      sliders.push(img);
      
    } else {
      const newSlider=sliders.filter(element=>element!=img);
      sliders=[];
      sliders=newSlider;
      event.path[1].classList.toggle('added');
    }
  }
}
var timer
const createSlider = () => {

  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 image.')
    return;
  }
  // crate slider previous next area
  sliderContainer.innerHTML = '';
  const prevNext = document.createElement('div');
  prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
  prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

  sliderContainer.appendChild(prevNext)
  document.querySelector('.main').style.display = 'block';
  // hide image aria
  imagesArea.style.display = 'none';
  const duration = parseInt(document.getElementById('duration').value) || 1000;
  if(duration>0){
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);
  }
  else{
    // durationInvalidMessage();
    alert("Duration should be a positive value");
    window.location.reload();
  }


}

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
}


// change slide item
const changeSlide = (index) => {
  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
}

searchBtn.addEventListener('click', function () {
  gallery.innerHTML="";
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  
  const search = document.getElementById('search');
  
  getImages(search.value)
  sliders.length = 0;
})


sliderBtn.addEventListener('click', function () {
  createSlider()
})


const noResultFound=()=>{
  const noResultDiv=document.getElementById('no-result');
  noResultDiv.style.textAlign='center';
  noResultDiv.innerHTML="No results found, Please try again.";
}


function enterPress(){
  document.getElementById('search').addEventListener("keypress", function(event) {
    if (event.keyCode == 13)
        searchBtn.click();
  });
}
enterPress();