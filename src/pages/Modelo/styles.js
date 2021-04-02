import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex: 1;
  background: #f1f1f1;
`;

export const Page = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const LoginPanel = styled.div.attrs({
  className: "shadow",
})`
  background: #fff;

  width: 900px;
  min-height: 430px;

  border-radius: 5px;
  flex-grow: 1;
  display: flex;

  .MuiGrid-root {
    display: flex;
  }
`;

export const ContainerLogo = styled.div`
  flex: 1;
  border-right: 2px solid #ff500f;
  background: linear-gradient(90deg, #ec5923 10.5%, #fd7e4e 123.83%);
  justify-content: center;
  align-items: center;
  display: flex;

  img {
    margin-top: -150px;
    width: 120px;
  }
`;

export const LoginHeader = styled.div.attrs({
  className: "shadow contentCenter",
})`
  flex: 1;
  height: 125px;
  margin-top: -25px;

  background: linear-gradient(to right, #f1f1f1, #fff);
  border-radius: 3px;

  h1 {
    color: #fff;
    font-weight: 300;
  }
`;

export const LoginBody = styled.div`
  flex: 1;
  margin-top: 40px;
  margin-bottom: 20px;
  padding-left: 25px;
  padding-right: 25px;

  h3 {
    color: #ff500f;
    font-size: 20px;
    font-weight: 500;
    padding-bottom: 50px;

    span {
      color: #ccc;
      font-weight: 400;
    }
  }
`;

export const ContainerOption = styled.div`
  flex: 1;
  height: 50px;
  margin-top: 10px;
  float: right;

  button {
    font-size: 12px !important;
  }
`;
