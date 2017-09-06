import React, { Component } from 'react';
import Product from './js/Product';
import { products } from './js/seed';

class ProductList extends Component {
  state = { products: [] };

  componentDidMount() {
    this.setState(
      { products }
    )
  }

  handleProductUpVote = (productId) => {
    console.log(`${productId} was upvoted.`);
    const nextProducts = this.state.products.map((product) => {
      if (product.id === productId) {
        return Object.assign({}, product, {
          votes: product.votes + 1
        });
      } else {
        return product;
      }
    });

    this.setState({ products: nextProducts});
  }

  render() {
    const productComponents = this.state.products
      .sort((a, b) => (b.votes - a.votes))
      .map((product) => (
        <Product
          key={`product-${product.id}`}
          id={product.id}
          title={product.title}
          description={product.description}
          url={product.url}
          votes={product.votes}
          submitter_avatar_url={product.submitter_avatar_url}
          product_image_url={product.product_image_url}
          onVote={this.handleProductUpVote}
        />
      ));

    return (
      <div className='ui unstackable items'>
        {productComponents}
      </div>
    );
  }
}
export default ProductList;
