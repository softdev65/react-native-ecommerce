import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';

import PlaceholderLoading from '~/components/PlaceholderLoading';

import ProductsActions from '~/store/ducks/products';

import {
  Container, ProductsList, ProductItem, Image, Name, Brand, Price,
} from './styles';

class ProductList extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    ).isRequired,
    categoryId: PropTypes.number.isRequired,
    loadProductsRequest: PropTypes.func.isRequired,
    navigation: PropTypes.shape({
      navigate: PropTypes.func.isRequired,
    }).isRequired,
  };

  state = {
    currentCategory: 1,
  };

  componentDidMount() {
    this.loadProductsList();
  }

  componentDidUpdate() {
    const { categoryId } = this.props;
    const { currentCategory } = this.state;

    if (currentCategory !== categoryId) this.loadProductsList();
  }

  loadProductsList = () => {
    const { categoryId, loadProductsRequest } = this.props;
    this.setState({ currentCategory: categoryId });

    loadProductsRequest(categoryId);
  };

  handleProductClick = (product) => {
    const { navigation } = this.props;

    navigation.navigate('Product', { product });
  };

  render() {
    const { items, loading } = this.props;

    return loading ? (
      <PlaceholderLoading loading={loading} />
    ) : (
      <Container>
        <ProductsList
          data={items}
          keyExtractor={item => String(item.id)}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: product }) => (
            <ProductItem onPress={() => this.handleProductClick(product)}>
              <Image source={{ uri: product.image }} />
              <Name>{product.name}</Name>
              <Brand>{product.brand}</Brand>
              <Price>{`$ ${product.price}`}</Price>
            </ProductItem>
          )}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  items: state.products.items,
  loading: state.products.loading,
  categoryId: state.categories.currentId,
});

const mapDispatchToProps = dispatch => bindActionCreators(ProductsActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withNavigation(ProductList));
