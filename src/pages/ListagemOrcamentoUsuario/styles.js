import styled from "styled-components";

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex: 1;
  background: #f1f1f1;
`;

export const ContainerModal = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ContainerInfo = styled.div`
  padding: 15px;
  background: #f7f7f7;
`;

export const ContainerNovo = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ContainerCarro = styled.div`
  display: flex;
  flex-direction: column;
`;

export const HeaderCarro = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TitleCarro = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;

  & > h6 {
    margin-left: 10px;
  }
`;

export const ContainerLabel = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Label = styled.span`
  margin-right: 5px;
`;

export const Value = styled.span`
  font-weight: 600;
`;
