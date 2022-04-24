import styled from 'styled-components';

export const Container = styled.div`
    grid-area: AS;
    
    background-color: ${props => props.theme.color.secondary};
    padding-left: 20px;

    border-right: 1px solid ${props => props.theme.color.gray};

   a {
    color: ${props => props.theme.color.info};
    text-decoration: none;

    margin: 8px 0;
    display: flex;
    align-items: center;

    transition: opacity .4s;

    &:hover {
        opacity: .8;
    }
    > svg {
        font-size: 18px;
        margin-right: 6px;
    }
}
`;

export const Header = styled.header`
    height: 60px;
    display: row;
    align-items: center;

`;

export const LogImg = styled.img`

    height: 90px;
    width: 90px;
`;

export const Title = styled.h3`
    color: ${props => props.theme.color.white};
    margin-left: 10px;

`;

export const MenuContainer = styled.nav`
    display: flex;
    flex-direction: column;
    margin-top: 70px;

`;


