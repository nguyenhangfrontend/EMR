import styled from "styled-components";

export const Main = styled.div`

  button.take-photo {
    background: none;
    border: 3px solid #46ace0;
    width: 62px;
    height: 62px;
    color: #46ace0;
    border-radius: 100%;
    font-size: 27px;
  }
  

  .take-photo .btn-upload-file img {
    width: auto;
    margin-right: 10px;
  }
  .display-error {
    display: none;
  }
  .take-photo .image-preview img {
    position: absolute;
    top: 50%;
    max-width: 40%;
    height: 57%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px dashed;
  }


&.video-screen {
    position: relative;
    z-index: 999;
    text-align: center;
    z-index: 999;
    background-color: #314047;
    margin: auto;
    height: calc(100vh - 300px);
  }

  .image-preview {
    display: flex;
    justify-content: center;
    justify-items: center;
    background-color: #000;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    img {
      max-width: 100%;
      max-height: 100%;
      align-self: center;
    }
  }


  .react-html5-camera-photo  {
    height: 100%
    video, img {
      height: 100%;
      width: 100%;
    }
  }
  
  #container-circles {
    bottom: -30px;
    #outer-circle {
      background-color: hsl(0deg 2% 24% / 40%);
      height: 50px;
      width: 50px;
      #inner-circle {
        background: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        margin: 0;
        width: 30px;
        height: 30px;
      }
    }
  }
  #display-error {
    display: none;
  }
  .name-image {
    margin-left: 12px;
  }
`;
