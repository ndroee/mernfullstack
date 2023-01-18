const nama = "wkwkwk";
let umur = 20;

function generateBio() {
  if (umur >= 21) {
    console.log("dewasa");
  } else {
    console.log("bocil");
  }
}
console.log(`si ${nama} adalah ${generateBio()}`);