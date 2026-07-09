export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const PaintingPartsFragmentDoc = gql`
    fragment PaintingParts on Painting {
  __typename
  title
  image
  month
  year
  medium
  category
  palette
  style
  description
}
    `;
export const PhotographyPartsFragmentDoc = gql`
    fragment PhotographyParts on Photography {
  __typename
  title
  image
  client
  category
  role
}
    `;
export const VideographyPartsFragmentDoc = gql`
    fragment VideographyParts on Videography {
  __typename
  title
  category
  thumbnail
  videoUrl
}
    `;
export const AboutPartsFragmentDoc = gql`
    fragment AboutParts on About {
  __typename
  profileImage
  body
}
    `;
export const PaintingDocument = gql`
    query painting($relativePath: String!) {
  painting(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PaintingParts
  }
}
    ${PaintingPartsFragmentDoc}`;
export const PaintingConnectionDocument = gql`
    query paintingConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PaintingFilter) {
  paintingConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PaintingParts
      }
    }
  }
}
    ${PaintingPartsFragmentDoc}`;
export const PhotographyDocument = gql`
    query photography($relativePath: String!) {
  photography(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...PhotographyParts
  }
}
    ${PhotographyPartsFragmentDoc}`;
export const PhotographyConnectionDocument = gql`
    query photographyConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: PhotographyFilter) {
  photographyConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...PhotographyParts
      }
    }
  }
}
    ${PhotographyPartsFragmentDoc}`;
export const VideographyDocument = gql`
    query videography($relativePath: String!) {
  videography(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...VideographyParts
  }
}
    ${VideographyPartsFragmentDoc}`;
export const VideographyConnectionDocument = gql`
    query videographyConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: VideographyFilter) {
  videographyConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...VideographyParts
      }
    }
  }
}
    ${VideographyPartsFragmentDoc}`;
export const AboutDocument = gql`
    query about($relativePath: String!) {
  about(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...AboutParts
  }
}
    ${AboutPartsFragmentDoc}`;
export const AboutConnectionDocument = gql`
    query aboutConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: AboutFilter) {
  aboutConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...AboutParts
      }
    }
  }
}
    ${AboutPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    painting(variables, options) {
      return requester(PaintingDocument, variables, options);
    },
    paintingConnection(variables, options) {
      return requester(PaintingConnectionDocument, variables, options);
    },
    photography(variables, options) {
      return requester(PhotographyDocument, variables, options);
    },
    photographyConnection(variables, options) {
      return requester(PhotographyConnectionDocument, variables, options);
    },
    videography(variables, options) {
      return requester(VideographyDocument, variables, options);
    },
    videographyConnection(variables, options) {
      return requester(VideographyConnectionDocument, variables, options);
    },
    about(variables, options) {
      return requester(AboutDocument, variables, options);
    },
    aboutConnection(variables, options) {
      return requester(AboutConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
