from opensearchpy import OpenSearch

from scoap3.management.commands.utils import check_time_unit, get_query


class OpenSearchClient:
    def __init__(self, host, port, username, password, index):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.index = index
        self.es = OpenSearch(
            [
                dict(
                    host=self.host,
                    port=self.port,
                    http_auth=(self.username, self.password),
                    use_ssl=True,
                    verify_certs=False,
                    timeout=60,
                    url_prefix="os",
                    http_compress=True,
                )
            ]
        )
        self.es.cluster.health()

    def get_items(self, batch_size, gte, time_unit, parse_function, action):
        self.es.indices.refresh(self.index)
        scroll = "30s"
        time_unit = check_time_unit(time_unit=time_unit)
        query = get_query(action=action, gte=gte, time_unit=time_unit)
        response = self.es.search(
            index=self.index,
            scroll=scroll,
            size=batch_size,
            body=query,
        )
        items = parse_function(es=self.es, response=response, scroll=scroll)
        return items
