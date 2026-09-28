export default function ArticleBlocks({ blocks, sectionTitle }) {
  return blocks.map((block, index) => {
    const key = `${block.type}-${index}`;
    if (block.type === 'heading') return <h3 key={key} id={block.id}>{block.text}</h3>;
    if (block.type === 'list') {
      const List = block.ordered ? 'ol' : 'ul';
      return <List key={key}>{block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>)}</List>;
    }
    if (block.type === 'table') {
      return (
        <div key={key} className="blog-detail__table-scroll" role="region" aria-label={`${sectionTitle}: comparison table`} tabIndex={0}>
          <table>
            <caption>{sectionTitle}</caption>
            <thead><tr>{block.headers.map((heading, column) => <th key={column} scope="col">{heading}</th>)}</tr></thead>
            <tbody>{block.rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, column) => column === 0 ? <th key={column} scope="row">{cell}</th> : <td key={column}>{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    }
    return <p key={key}>{block.text}</p>;
  });
}
