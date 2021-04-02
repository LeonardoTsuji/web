import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex: 1;
  margin: 0 auto;
  background: #f5f6f6;
  padding-bottom: 65px;
`;

export const ContainerTitle = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
`;

export const ContainerSubtitle = styled.div`
  height: 100%;
  width: 100%;
  text-align: center;
  background: #f5f6f6;
  padding: 20px;
`;

export const Wallpaper = styled.div`
  width: 100%;
  height: 100vh;
  background-image: url(${(props) => props.src});
  background-position: center;
  background-size: cover;
`;

export const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
