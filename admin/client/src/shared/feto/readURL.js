export function readURL(input) {
  let picsize = 0;
  if (input.files && input.files[0]) {

    var reader = new FileReader();

    reader.onload = function () {
      let fl = input.files[0];
      picsize = fl.size;
      //picsrc=fl.src;
      //picnaturalWidth=fl.naturalWidth;

      // $('#demoimage').attr('src', e.target.result);
      // $('#demoimage').attr('alt', 'Загруженное фото');
    }
    reader.readAsDataURL(input.files[0]);
  }
}